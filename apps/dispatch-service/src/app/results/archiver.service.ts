import { Injectable, Logger } from '@nestjs/common';

import { SimulationRunService } from '@biosimulations/api-nest-client';
import { map, mergeMap, pluck } from 'rxjs/operators';
import { firstValueFrom, Observable } from 'rxjs';

import {
  FileInfo,
  OutputFileName,
  SimulationStorageService,
} from '@biosimulations/shared/storage';
import { SimulationRun } from '@biosimulations/datamodel/api';

@Injectable()
export class ArchiverService {
  private logger = new Logger('ArchiverService');

  public constructor(
    private service: SimulationRunService,
    private storage: SimulationStorageService,
  ) {}
  public updateResultsSize(id: string): Observable<number | undefined> {
    const info = this.storage
      .getSimulationRunOutputFileInfo(id, OutputFileName.OUTPUT_ARCHIVE)
      .pipe(
        map((info: FileInfo) => {
          if (info.size) {
            return this.service.updateSimulationRunResultsSize(
              id,
              info.size,
              info.url,
            );
          } else {
            throw new Error(`Could not update file size for ${id}`);
          }
        }),
        mergeMap((result) => result),
        pluck<SimulationRun, 'resultsSize'>('resultsSize'),
      );
    return info;
  }
}
