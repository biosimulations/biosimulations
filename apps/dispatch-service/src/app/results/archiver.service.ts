import { Injectable, Logger } from '@nestjs/common';

import { SimulationRunService } from '@biosimulations/api-nest-client';
import { SimulationStorageService } from '@biosimulations/shared/storage';
import { FilePaths } from '@biosimulations/shared/storage';

@Injectable()
export class ArchiverService {
  private logger = new Logger('ArchiverService');

  public constructor(
    private service: SimulationRunService,
    private storage: SimulationStorageService,
    private filePaths: FilePaths,
  ) {}

  // TODO include the output archive in the files endpoint and get size from there
  public async updateResultsSize(runId: string): Promise<void> {
    const outputArchiveS3Path = this.filePaths.getSimulationRunOutputArchivePath(runId, false);

    const fileInfo = await this.storage
      .getSimulationRunFileInfo(runId, outputArchiveS3Path)
      .toPromise();

    if (fileInfo?.size === undefined) {
      this.logger.error(
          `The results size for simulation run '${runId}' could not be retrieved.`,
        );
    } else {
      await this.service
        .updateSimulationRunResultsSize(runId, fileInfo.size)
        .toPromise()
        .catch((error: any) => {
          this.logger.error(
            `The results size for simulation run '${runId}' could not be updated: ${error}`,
          );
        });
    }
  }
}
