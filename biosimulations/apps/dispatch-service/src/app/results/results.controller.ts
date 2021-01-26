import { SimulationRunService } from '@biosimulations/dispatch/nest-client';
import {
  DispatchFinishedPayload,
  DispatchMessage
} from '@biosimulations/messages/messages';
import { Controller, Logger } from '@nestjs/common';

import { MessagePattern } from '@nestjs/microservices';
import { SimulationRunStatus } from '@biosimulations/datamodel/common'
import { ArchiverService } from '../services/archiver/archiver.service';
import { ResultsService } from './results.service';

@Controller()
export class ResultsController {
  constructor(
    private resultsService: ResultsService,
    private archiverService: ArchiverService,
    private simService: SimulationRunService
  ) { }

  private logger = new Logger(ResultsController.name);

  @MessagePattern(DispatchMessage.finished)
  private async processResults(data: DispatchFinishedPayload): Promise<void> {
    const id = data.id;
    const transpose = data.transpose;

    this.logger.log(`Simulation ${id} Finished`);

    // TODO move the logging methods to seperate service, add here
    await Promise.all([
      this.archiverService.createResultArchive(id),
      this.resultsService.createResults(id, transpose)])

    this.simService.updateSimulationRunStatus(id, SimulationRunStatus.SUCCEEDED).subscribe(
      (run) => this.logger.log(`Updated Simulation ${run.id} to complete`)
    )
  }
}
