import { SimulationStorageService } from '@biosimulations/shared/storage';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ExtractionService {
  private logger = new Logger(ExtractionService.name);
  public constructor(
    private simulationStorageService: SimulationStorageService,
  ) {}

  public extractSimulationArchive(id: string): Promise<string[]> {
    this.logger.debug('Beginning extraction of archive for simulation');
    return this.simulationStorageService
      .extractSimulationArchive(id)
      .then((uploadedArchiveContents) => {
        this.logger.debug(
          `Extracted simulation archive for simulation run '${id}'`,
        );
        return uploadedArchiveContents;
      })
      .catch((error) => {
        this.logger.error(`Error extracting simulation archive: ${error}`);
        throw error;
      });
  }
}
