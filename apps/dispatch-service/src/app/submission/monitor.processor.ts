import { SimulationRunStatus } from '@biosimulations/datamodel/common';
import {
  CompleteJob,
  FailJob,
  JobQueue,
  MonitorJob,
} from '@biosimulations/messages/messages';
import { Processor, InjectQueue, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { HpcService } from '../services/hpc/hpc.service';
import { SimulationStatusService } from '../services/simulationStatus.service';
const MAX_MONITOR_RETRY = 20;
@Processor(JobQueue.monitor)
export class MonitorProcessor {
  private readonly logger = new Logger(MonitorProcessor.name);
  public constructor(
    private simStatusService: SimulationStatusService,
    private hpcService: HpcService,

    @InjectQueue(JobQueue.monitor) private monitorQueue: Queue<MonitorJob>,
    @InjectQueue(JobQueue.complete) private completeQueue: Queue<CompleteJob>,
    @InjectQueue(JobQueue.fail) private failQueue: Queue<FailJob>,
  ) {}

  @Process()
  private async handleMonitoring(job: Job<MonitorJob>): Promise<void> {
    const data = job.data;
    const slurmJobId = data.slurmJobId;
    const projectId = data.projectId;
    const projectOwner = data.projectOwner;
    const simId = data.simId;
    let retryCount = data.retryCount;
    const DELAY = 5000;
    const jobStatus: SimulationRunStatus | null =
      await this.hpcService.getJobStatus(slurmJobId);

    const message = `Checking status for job with id ${slurmJobId} for simulation ${simId}: Status is ${jobStatus}`;
    this.logger.debug(message);

    if (jobStatus) {
      this.simStatusService.updateStatus(simId, jobStatus, message);
    }

    if (jobStatus == SimulationRunStatus.PROCESSING) {
      this.completeQueue.add({ simId, projectId, projectOwner });
    } else if (jobStatus == SimulationRunStatus.FAILED) {
      this.failQueue.add({ simId, reason: message });
    } else if (
      jobStatus == SimulationRunStatus.QUEUED ||
      jobStatus == SimulationRunStatus.RUNNING
    ) {
      this.monitorQueue.add(
        { slurmJobId, simId, projectId, projectOwner, retryCount },
        { delay: DELAY },
      );
    } else {
      this.logger.warn(
        `${simId} skipped update, due to unknown status of ${jobStatus}`,
      );
      // If we keep getting some unknown status that does not resolve, fail the job after some limit of retries
      if (retryCount < MAX_MONITOR_RETRY) {
        retryCount = retryCount + 1;
        this.monitorQueue.add(
          { slurmJobId, simId, projectId, projectOwner, retryCount },
          { delay: DELAY },
        );
      } else {
        this.logger.error(
          `${simId} failed due to exceeded retry limit of status ${jobStatus}`,
        );
        this.failQueue.add({ simId, reason: message });
      }
    }
  }
}
