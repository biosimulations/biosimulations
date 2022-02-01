import { SimulationRunStatus } from '@biosimulations/datamodel/common';
import {
  DispatchJobData,
  JobQueue,
  MonitorJobData,
} from '@biosimulations/messages/messages';

import { BiosimulationsException } from '@biosimulations/shared/exceptions';
import { InjectQueue, Process, Processor } from '@ejhayes/nestjs-bullmq';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { HpcService } from '../services/hpc/hpc.service';
import { SimulationStatusService } from '../services/simulationStatus.service';

@Processor(JobQueue.dispatch)
export class DispatchProcessor {
  private readonly logger = new Logger(DispatchProcessor.name);

  public constructor(
    private hpcService: HpcService,
    private simStatusService: SimulationStatusService,
    @InjectQueue(JobQueue.monitor) private monitorQueue: Queue<MonitorJobData>,
  ) {}

  @Process()
  private async handleSubmission(job: Job<DispatchJobData>): Promise<void> {
    const data = job.data;

    this.logger.debug(`Starting job for simulation run '${data.runId}' ...`);

    // submit job to HPC
    this.logger.debug(
      `Submitting job for simulation run '${data.runId}' to HPC ...`,
    );
    const response = await this.hpcService.submitJob(
      data.runId,
      data.simulator,
      data.version,
      data.cpus,
      data.memory,
      data.maxTime,
      data.envVars,
      data.purpose,
      data.fileName,
    );

    if (response.stderr != '' || response.stdout === null) {
      // There was an error with submission of the job
      const message = `An error occurred in submitting an HPC job for simulation run '${data.runId}': ${response.stderr}`;
      this.logger.error(message);
      if (job.attemptsMade >= (job.opts.attempts || 0)) {
        await this.simStatusService.updateStatus(
          data.runId,
          SimulationRunStatus.FAILED,
          message,
        );
      }

      throw new BiosimulationsException(
        500,
        'Error occurred in job Submission',
        message,
      );
    }

    // Get the Slurm id of the job
    // Expected output of the response is " Submitted batch job <ID> /n"
    const slurmjobId = response.stdout.trim().split(' ').slice(-1)[0];

    // Initiate monitoring of the job
    this.logger.debug(
      `Initiating monitoring for job '${slurmjobId}' for simulation run '${data.runId}' ...`,
    );

    const monitorData: MonitorJobData = {
      slurmJobId: slurmjobId.toString(),
      runId: data.runId,
      projectId: data.projectId,
      projectOwner: data.projectOwner,
      retryCount: 0,
    };

    this.monitorQueue.add('monitor', monitorData);
  }
}
