import { SimulationRunStatus } from '@biosimulations/datamodel/common';
import { JobQueue } from '@biosimulations/messages/messages';

import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { ArchiverService } from '../results/archiver.service';
import { LogService } from '../results/log.service';

import { SimulationStatusService } from '../services/simulationStatus.service';

@Processor(JobQueue.complete)
export class CompleteProccessor {
  private readonly logger = new Logger(CompleteProccessor.name);
  public constructor(
    private archiverService: ArchiverService,
    private simStatusService: SimulationStatusService,
    private logService: LogService,
  ) {}

  @Process()
  private async handleProcessing(job: Job): Promise<void> {
    const data = job.data;

    const id = data.simId;

    this.logger.log(`Simulation ${id} Finished. Creating logs and output`);

    const processed: PromiseSettledResult<void>[] = await Promise.allSettled([
      this.archiverService.updateResultsSize(id),
      this.logService.createLog(id),
    ]);

    let completed = true;
    let reason = '';
    for (const val of processed) {
      if (val.status == 'rejected') {
        completed = false;
        reason = val.reason;
        this.logger.error(val.reason);
      }
    }
    const errorMessage = `Updating Simulation ${id} to failed due to processing error: ${reason}`;
    if (completed) {
      this.simStatusService
        .updateStatus(id, SimulationRunStatus.SUCCEEDED, 'Completed')
        .then((run) => this.logger.log(`Updated Simulation ${id} to complete`));
    } else {
      this.simStatusService
        .updateStatus(id, SimulationRunStatus.FAILED, errorMessage)
        .then((run) => this.logger.error(errorMessage));
    }
  }
}
