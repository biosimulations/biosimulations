import { SimulationRunService } from '@biosimulations/api-nest-client';
import {
  CombineArchiveLog,
  ConsoleFormatting,
  SedOutputElementLog,
  SimulationRunLogStatus,
  SimulationRunStatus,
} from '@biosimulations/datamodel/common';
import { CompleteJobData, JobQueue } from '@biosimulations/messages/messages';
import { Processor, WorkerHost, InjectQueue } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { FlowProducer, Job, JobNode, Queue } from 'bullmq';
import { firstValueFrom } from 'rxjs';
import { SimulationStatusService } from '../services/simulationStatus.service';

type stepsInfo = {
  name: string;
  status: string;
  returnValue: any;
  required: boolean;
  errorMessage: string;
  reason: string;
  description: string;
  data: any;
  children: string[];
};
@Processor(JobQueue.complete, { concurrency: 1 })
export class CompleteProcessor extends WorkerHost {
  private readonly logger = new Logger(CompleteProcessor.name);
  private flowProducer: FlowProducer;
  public constructor(
    private simStatusService: SimulationStatusService,
    @InjectQueue(JobQueue.publish) private publishQueue: Queue,
    @InjectQueue(JobQueue.clean) private cleanUpQueue: Queue,
    private submit: SimulationRunService,
    private configService: ConfigService,
  ) {
    super();
    const queuehost = this.configService.get('queue.host');
    const queueport = this.configService.get('queue.port');
    this.flowProducer = new FlowProducer({
      connection: { host: queuehost, port: queueport },
    });
  }

  public async process(job: Job<CompleteJobData, void, 'complete'>): Promise<void> {
    const data = job.data;
    const runId = data.runId;
    const projectId = data.projectId;
    const projectOwner = data.projectOwner;
    const runStatus = data.status;

    if (!job?.id) {
      throw new Error('Job id is not defined');
    }

    const flow = await this.flowProducer.getFlow({
      id: job.id,
      queueName: job.queueName,
    });
    const steps: stepsInfo[] = this.getJobTreeInfo(flow, true);

    const errorSteps = steps.filter((step) => step.status === 'Failed' && step.required);

    const warningSteps = steps.filter((step) => step.status === 'Failed' && !step.required);

    const succeededSteps = steps.filter((step) => step.status === 'Succeeded');

    const originalLog: CombineArchiveLog = steps
      .filter((step) => step.name === 'Logs')
      .map((step) => step.returnValue)[0];

    const logSucceeded = this.getRunSucceededFromLog(originalLog);

    const processingLog = this.makeLogString(errorSteps, warningSteps, succeededSteps);

    if (originalLog) {
      originalLog.output = originalLog.output + processingLog;

      await firstValueFrom(this.submit.sendLog(runId, originalLog, true));
    }

    const runSucceeded = data.status === SimulationRunStatus.SUCCEEDED;
    //const statusReason = data.statusReason;

    const processingSucceeded = errorSteps.length === 0;
    const finalStatus =
      logSucceeded && runSucceeded && processingSucceeded ? SimulationRunStatus.SUCCEEDED : SimulationRunStatus.FAILED;

    if (finalStatus === SimulationRunStatus.SUCCEEDED) {
      await this.simStatusService.updateStatus(runId, SimulationRunStatus.SUCCEEDED);
    } else {
      await this.simStatusService.updateStatus(runId, SimulationRunStatus.FAILED);
    }

    const oneDay = 24 * 60 * 60 * 1000;

    //clean queues
    if (finalStatus === SimulationRunStatus.SUCCEEDED) {
      this.cleanUpQueue.add(
        'Clean Successful',
        {
          runId: runId,
          queueName: JobQueue.complete,
        },
        {
          removeOnComplete: 10,
          removeOnFail: 100,
        },
      );
    } else {
      this.cleanUpQueue.add(
        'Clean Failed',
        {
          runId: runId,
          queueName: JobQueue.complete,
        },
        {
          delay: oneDay,
          removeOnComplete: 10,
          removeOnFail: 100,
        },
      );
    }

    const publishable = processingSucceeded && logSucceeded && runSucceeded && warningSteps.length === 0;
    if (publishable) {
      this.publishQueue.add('publish', {
        runId,
        finalStatus,
        projectOwner,
        projectId,
      });
    }
  }

  private makeLogString(errorSteps: stepsInfo[], warningSteps: stepsInfo[], succeededSteps: stepsInfo[]): string {
    const cyan = ConsoleFormatting.cyan.replace('\\033', '\u001b');
    const red = ConsoleFormatting.red.replace('\\033', '\u001b');
    const yellow = ConsoleFormatting.yellow.replace('\\033', '\u001b');
    const green = ConsoleFormatting.green.replace('\\033', '\u001b');
    const noColor = ConsoleFormatting.noColor.replace('\\033', '\u001b');

    const successLog =
      succeededSteps.length > 0
        ? `\n${green}${succeededSteps.map((step) => step.description + ' ... succeeded.').join('\n')}${noColor}`
        : '';
    const warningLog =
      warningSteps.length > 0
        ? `\n${yellow}${warningSteps
            .map((step) => this.getFailedStepErrorMessage(step, warningSteps))
            .join('\n')}${noColor}`
        : '';
    const errorLog =
      errorSteps.length > 0
        ? `\n${red}${errorSteps.map((step) => this.getFailedStepErrorMessage(step, errorSteps)).join('\n')}${noColor}`
        : '';

    const finalLog =
      '' +
      '\n' +
      `${cyan}=========================================== Post-processing simulation run ==========================================${noColor}` +
      successLog +
      warningLog +
      errorLog +
      '\n' +
      `${cyan}================================ Run complete. Thank you for using runBioSimulations! ===============================${noColor}`;

    return finalLog;
  }

  private getFailedStepErrorMessage(step: stepsInfo, failedSteps: stepsInfo[]): string {
    let suffix = ' ... failed';
    if (step.reason) {
      suffix += ' due to: ' + step.reason;
    }
    let message = step.description + suffix;
    let failedDueToChild = false;
    const children = step.children;
    children.forEach((child) => {
      if (failedSteps.map((step) => step.name).includes(child)) {
        failedDueToChild = true;
      }
    });
    if (!failedDueToChild) {
      message = message + ':\n' + step.errorMessage;
    } else {
      message = message + ' due to a dependent step failing.';
    }
    return message;
  }
  private getRunSucceededFromLog(log?: CombineArchiveLog): boolean {
    if (log === undefined) {
      return false;
    }

    if (log.status !== SimulationRunLogStatus.SUCCEEDED) {
      return false;
    }

    for (const sedDocLog of log.sedDocuments || []) {
      if (sedDocLog.status !== SimulationRunLogStatus.SUCCEEDED) {
        return false;
      }
      for (const taskLog of sedDocLog.tasks || []) {
        if (taskLog.status !== SimulationRunLogStatus.SUCCEEDED) {
          return false;
        }
      }
      for (const outputLog of sedDocLog.outputs || []) {
        if (outputLog.status !== SimulationRunLogStatus.SUCCEEDED) {
          return false;
        }

        let outputElementsLogs: SedOutputElementLog[] | null = null;
        if ('dataSets' in outputLog) {
          outputElementsLogs = outputLog.dataSets;
        } else if ('curves' in outputLog) {
          outputElementsLogs = outputLog.curves;
        } else if ('surfaces' in outputLog) {
          outputElementsLogs = outputLog.surfaces;
        }

        for (const outputElementsLog of outputElementsLogs || []) {
          if (outputElementsLog.status !== SimulationRunLogStatus.SUCCEEDED) {
            return false;
          }
        }
      }
    }

    return true;
  }

  private getJobTreeInfo(flow: JobNode, root: boolean): stepsInfo[] {
    const steps: stepsInfo[] = [];
    flow?.children?.forEach((child) => {
      steps.push(...this.getJobTreeInfo(child, false));
    });
    if (!root) {
      const children = flow?.children?.map((child) => child.job.name) || [];

      let errorMessage = flow.job.data.errorMessage;
      if (flow.job.data.moreInfo) {
        errorMessage += ` More information is available at ${flow.job.data.moreInfo}.`;
      }
      if (flow.job.data.validator) {
        errorMessage += ` A validation tool is available at ${flow.job.data.validator}.`;
      }

      steps.push({
        name: flow.job.name,
        status: flow.job.returnvalue.status,
        reason: flow.job.returnvalue.reason,
        returnValue: flow.job.returnvalue.data,
        required: flow.job.data.required,
        description: flow.job.data.description,
        errorMessage: flow.job.data.errorMessage,
        data: flow.job.data,
        children: children,
      });
    }

    return steps;
  }
}
