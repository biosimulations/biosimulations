import { SimulationRunStatus } from '@biosimulations/datamodel/common';
import {
  CompleteJob,
  FailJob,
  MonitorJob,
} from '@biosimulations/messages/messages';
import { Processor, InjectQueue, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { HpcService } from '../services/hpc/hpc.service';
import { SimulationStatusService } from '../services/simulationStatus.service';

@Processor('monitor')
export class MonitorProcessor {
  private readonly logger = new Logger(MonitorProcessor.name);
  public constructor(
    private simStatusService: SimulationStatusService,
    private hpcService: HpcService,

    @InjectQueue('monitor') private monitorQueue: Queue<MonitorJob>,
    @InjectQueue('complete') private completeQueue: Queue<CompleteJob>,
    @InjectQueue('fail') private failQueue: Queue<FailJob>,
  ) {}

  @Process()
  private async handleMonitoring(job: Job): Promise<void> {
    const data = job.data;
    const slurmJobId = data.slurmJobId;
    const simId = data.simId;
    const transpose = data.transpose;
    const DELAY = 5000;
    const jobStatus: SimulationRunStatus | null = await this.hpcService.getJobStatus(
      slurmJobId,
    );

    const message = `Checking status for job with id ${slurmJobId} for simulation ${simId}: Status is ${jobStatus}`;
    this.logger.debug(message);

    if (jobStatus) {
      this.simStatusService.updateStatus(simId, jobStatus, message);
    }

    if (jobStatus == SimulationRunStatus.PROCESSING) {
      this.completeQueue.add({ simId });
    } else if (jobStatus == SimulationRunStatus.FAILED) {
      this.failQueue.add({ simId, reason: message });
    } else if (
      jobStatus == SimulationRunStatus.QUEUED ||
      jobStatus == SimulationRunStatus.RUNNING
    ) {
      this.monitorQueue.add({ slurmJobId, simId }, { delay: DELAY });
    } else {
      this.logger.warn(
        `${simId} skipped update, due to unknown status of ${jobStatus}`,
      );
      this.monitorQueue.add({ slurmJobId, simId }, { delay: DELAY });
    }
  }
}
