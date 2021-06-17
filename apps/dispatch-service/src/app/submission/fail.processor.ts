import { SimulationRunStatus } from '@biosimulations/datamodel/common';
import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { ArchiverService } from '../results/archiver.service';
import { LogService } from '../results/log.service';

import { SimulationStatusService } from '../services/simulationStatus.service';

@Processor('fail')
export class FailProcessor {
  private readonly logger = new Logger(FailProcessor.name);
  public constructor(
    private archiverService: ArchiverService,
    private logService: LogService,
    private simStatusService: SimulationStatusService,
  ) {}

  @Process()
  private async failureHandler(job: Job): Promise<void> {
    const data = job.data;
    const id = data.simId;
    const reason = data.reason;

    this.logger.log(`Simulation ${id} Failed. Creating logs and output`);

    await Promise.allSettled([
      this.archiverService.updateResultsSize(id),
      this.logService.createLog(id),
    ]);

    this.simStatusService.updateStatus(id, SimulationRunStatus.FAILED, reason);
  }
}
