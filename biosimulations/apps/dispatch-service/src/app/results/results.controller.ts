import {
  DispatchFinishedPayload,
  DispatchMessage
} from '@biosimulations/messages/messages';
import { Controller, Logger } from '@nestjs/common';

import { MessagePattern } from '@nestjs/microservices';
import { ArchiverService } from '../services/archiver/archiver.service';
import { ResultsService } from './results.service';

@Controller()
export class ResultsController {
  constructor(
    private service: ResultsService,
    private archiverService: ArchiverService
  ) {}

  private logger = new Logger(ResultsController.name);

  @MessagePattern(DispatchMessage.finished)
  private async processResults(data: DispatchFinishedPayload): Promise<void> {
    const id = data.id;
    const transpose = data.transpose;
    this.logger.log(`Simulation ${id} Finished`);
    this.archiverService.createResultArchive(id);
    this.service.createResults(id, transpose);
  }
}
