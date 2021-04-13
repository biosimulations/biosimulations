import { SimulationRunService } from '@biosimulations/dispatch/nest-client';
import {
  DispatchFailedPayload,
  DispatchFinishedPayload,
  DispatchMessage,
} from '@biosimulations/messages/messages';
import { Controller, Logger } from '@nestjs/common';

import { MessagePattern } from '@nestjs/microservices';
import { SimulationRunStatus } from '@biosimulations/datamodel/common';
import { ArchiverService } from './archiver.service';
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

    const processed: PromiseSettledResult<void>[] = await Promise.allSettled([
      this.archiverService.createResultArchive(id),
      this.resultsService.createResults(id, transpose),
      this.logService.createLog(id),
    ]);

    let completed = true;

    for (const val of processed) {
      if (val.status == 'rejected') {
        completed = false;
        this.logger.error(val.reason);
      }
    }

    if (completed) {
      this.simService
        .updateSimulationRunStatus(id, SimulationRunStatus.SUCCEEDED)
        .subscribe((run) =>
          this.logger.log(`Updated Simulation ${run.id} to complete`),
        );
    } else {
      this.simService
        .updateSimulationRunStatus(id, SimulationRunStatus.FAILED)
        .subscribe((run) =>
          this.logger.log(
            `Updated Simulation ${run.id} to failed due to processing error`,
          ),
        );
    }
  }
  @MessagePattern(DispatchMessage.failed)
  public async processFailedResults(
    data: DispatchFailedPayload,
  ): Promise<void> {
    const id = data.id;

    this.logger.log(`Simulation ${id} Failed. Creating logs and output`);
    if (data.proccessOutput) {
      await Promise.allSettled([
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
