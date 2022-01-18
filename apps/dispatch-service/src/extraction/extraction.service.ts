import { SimulationStorageService } from '@biosimulations/shared/storage';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ExtractionService {
  private logger = new Logger(ExtractionService.name);
  public constructor(
    private simulationStorageService: SimulationStorageService,
  ) {}

  public extractSimulationArchive(id: string): Promise<string[]> {
    return this.simulationStorageService
      .extractSimulationArchive(id)
      .then((uploadedArchiveContents) => {
        this.logger.debug(
          `Uploaded archive contents: ${JSON.stringify(
            uploadedArchiveContents,
          )}`,
        );
        return uploadedArchiveContents;
      })
      .catch((error) => {
        this.logger.error(`Error extracting simulation archive: ${error}`);
        throw error;
      });
  }
}
