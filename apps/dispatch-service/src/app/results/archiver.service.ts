import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';

import { SimulationRunService } from '@biosimulations/api-nest-client';
import { catchError } from 'rxjs/operators';

import { SimulationStorageService } from '@biosimulations/shared/storage';
import { Endpoints, FilePaths } from '@biosimulations/config/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ArchiverService {
  private logger = new Logger('ArchiverService');
  private endpoints: Endpoints;
  private filePaths: FilePaths;

  public constructor(
    private configService: ConfigService,
    private service: SimulationRunService,
    private storage: SimulationStorageService,
  ) {
    const env = configService.get('server.env');
    this.endpoints = new Endpoints(env);
    this.filePaths = new FilePaths(env);
  }

  public async updateResultsSize(id: string): Promise<void> {
    this.logger.log(`Updating size of results for simulation run '${id}'.`);

    const s3path = this.filePaths.getSimulationRunOutputArchivePath(id);
    const properties = await this.storage.getFileProperties(s3path);
    if (properties.ContentLength === undefined) {
      const msg = `The results size for simulation run '${id}' could not be retrieved.`;
      this.logger.error(msg);
      throw new InternalServerErrorException(msg);
    }

    const runOrError = await this.service
      .updateSimulationRunResultsSize(id, properties.ContentLength)
      .pipe(
        catchError((err, caught) => {
          const msg = `The results size for simulation run '${id}' could not be updated: ${err}`;
          this.logger.error(msg);
          return msg;
        }),
      )
      .toPromise();

    if (typeof runOrError === 'string') {
      throw new InternalServerErrorException(runOrError);
    }
  }
}
