import { SimulationRunService } from '@biosimulations/dispatch/nest-client';
import {
  DispatchFailedPayload,
  DispatchFinishedPayload,
  DispatchMessage,
  DispatchPayload,
} from '@biosimulations/messages/messages';
import { Controller, Logger } from '@nestjs/common';

import { MessagePattern } from '@nestjs/microservices';
import { SimulationRunStatus } from '@biosimulations/datamodel/common';
import { ArchiverService } from '../services/archiver/archiver.service';
import { ResultsService } from './results.service';
import { LogService } from './log.service';

@Controller()
export class ResultsController {
  private logger = new Logger(ResultsController.name);

  public constructor(
    private resultsService: ResultsService,
    private archiverService: ArchiverService,
    private simService: SimulationRunService,
    private logService: LogService,
  ) {}

  @MessagePattern(DispatchMessage.finished)
  public async processResults(data: DispatchFinishedPayload): Promise<void> {
    const id = data.id;
    const transpose = data.transpose;

    this.logger.log(`Simulation ${id} Finished. Creating logs and output`);

    await Promise.all([
      this.archiverService.createResultArchive(id),
      this.resultsService.createResults(id, transpose),
      this.logService.createLog(id),
    ]);

    this.simService
      .updateSimulationRunStatus(id, SimulationRunStatus.SUCCEEDED)
      .subscribe((run) =>
        this.logger.log(`Updated Simulation ${run.id} to complete`),
      );
  }
  @MessagePattern(DispatchMessage.failed)
  public async processFailedResults(
    data: DispatchFailedPayload,
  ): Promise<void> {
    const id = data.id;

    this.logger.log(`Simulation ${id} Failed. Creating logs and output`);
    if (data.proccessOutput) {
      await Promise.all([
        this.archiverService.createResultArchive(id),
        this.logService.createLog(id),
      ]);
    }

    this.simService
      .updateSimulationRunStatus(id, SimulationRunStatus.FAILED)
      .subscribe((run) =>
        this.logger.log(`Updated Simulation ${run.id} to failed`),
      );
  }
}
