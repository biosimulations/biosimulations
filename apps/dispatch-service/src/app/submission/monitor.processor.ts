import { SimulationRunStatus, SimulationRunStatusReason } from '@biosimulations/datamodel/common';
import { CompleteJobData, JobQueue, MonitorJobData } from '@biosimulations/messages/messages';
import { Processor, InjectQueue, Process } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { HpcService } from '../services/hpc/hpc.service';
import { SimulationStatusService } from '../services/simulationStatus.service';

const MAX_MONITOR_RETRY = 20;

@Processor(JobQueue.monitor)
export class MonitorProcessor {
  private readonly logger = new Logger(MonitorProcessor.name);
  public constructor(
    private simStatusService: SimulationStatusService,
    private hpcService: HpcService,

    @InjectQueue(JobQueue.monitor) private monitorQueue: Queue<MonitorJobData>,
    @InjectQueue(JobQueue.process) private processQueue: Queue<CompleteJobData>,
  ) {}

  @Process({
    concurrency: 10,
  })
  private async handleMonitoring(job: Job<MonitorJobData, void>): Promise<void> {
    const data = job.data;
    const slurmJobId = data.slurmJobId;
    const projectId = data.projectId;
    const projectOwner = data.projectOwner;
    const runId = data.runId;
    let retryCount = data.retryCount;
    const DELAY = 5000;
    const jobStatusReason: SimulationRunStatusReason = await this.hpcService.getJobStatus(slurmJobId);

    const message = `Status for job '${slurmJobId}' for simulation run '${runId}' is '${jobStatusReason.status}'.`;
    this.logger.debug(message);

    if (jobStatusReason.status) {
      if ([SimulationRunStatus.SUCCEEDED, SimulationRunStatus.FAILED].includes(jobStatusReason.status)) {
        await this.simStatusService.updateStatus(runId, SimulationRunStatus.PROCESSING);
        this.startProcessingJob(runId, jobStatusReason.status, jobStatusReason.reason, projectId, projectOwner);
      } else {
        await this.simStatusService.updateStatus(runId, jobStatusReason.status);
        this.monitorQueue.add(
          'monitor',
          { slurmJobId, runId, projectId, projectOwner, retryCount },
          { delay: DELAY, removeOnComplete: 100, removeOnFail: 100 },
        );
      }
    } else {
      this.logger.warn(
        `The status of simulation run '${runId}' could not be updated because its status ` +
          `could not be retrieved from the HPC.`,
      );
      // If we keep getting some unknown status that does not resolve, fail the job after some limit of retries
      if (retryCount < MAX_MONITOR_RETRY) {
        retryCount = retryCount + 1;
        this.monitorQueue.add(
          'monitor',
          { slurmJobId, runId, projectId, projectOwner, retryCount },
          { delay: DELAY, removeOnComplete: 100, removeOnFail: 100 },
        );
      } else {
        this.logger.error(
          `Simulation run '${runId}' appears to have failed because its status could not retrieved ` +
            `in the allowed ${MAX_MONITOR_RETRY} number of tries.`,
        );
        this.startProcessingJob(runId, SimulationRunStatus.FAILED, message, projectId, projectOwner);
      }
    }
  }

  private startProcessingJob(
    runId: string,
    status: SimulationRunStatus,
    reason: string,
    projectId: string | undefined,
    projectOwner: string | undefined,
  ): void {
    this.processQueue.add(
      'process',
      {
        runId,
        status: status,
        projectId,
        projectOwner,
      },
      {
        jobId: `process--${runId}`,
        removeOnComplete: 100,
        removeOnFail: 100,
      },
    );
  }
}
