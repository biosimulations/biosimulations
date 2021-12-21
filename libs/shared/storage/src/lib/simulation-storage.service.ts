import { Injectable, Logger, InternalServerErrorException, HttpStatus } from '@nestjs/common';
import S3 from 'aws-sdk/clients/s3';
import * as AWS from 'aws-sdk';
import { SharedStorageService } from './shared-storage.service';
import { Endpoints } from '@biosimulations/config/common';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';

// hack to get typing to work see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/47780
// eslint-disable-next-line unused-imports/no-unused-imports-ts
import multer from 'multer';

@Injectable()
export class SimulationStorageService {
  private endpoints: Endpoints;
  private logger = new Logger(SimulationStorageService.name);

  public constructor(
    private storage: SharedStorageService,
    private configService: ConfigService,
  ) {
    const env = this.configService.get('server.env');
    this.endpoints = new Endpoints(env);
  }

  public async deleteSimulationRunResults(runId: string): Promise<void> {
    await this.deleteSimulationArchive(runId);
  }

  public async deleteSimulationRunFile(
    runId: string,
    fileLocation: string,
  ): Promise<void> {
    const fileObject = this.endpoints.getSimulationRunContentFileS3Path(
      runId,
      fileLocation,
    );
    const output = await this.storage.deleteObject(fileObject);

    await this.storage.getObject(fileObject)
      .then((file: AWS.S3.GetObjectOutput): void => {
        if (!file.DeleteMarker) {
          throw new InternalServerErrorException(`File '${fileLocation}' could not be deleted for simulation run '{runId}'.`);
        }
      })
      .catch((error: any): void => {
        if (error.status !== HttpStatus.NOT_FOUND && error.statusCode !== HttpStatus.NOT_FOUND) {
          throw error;
        }
      });
  }

  public async getSimulationRunOutputArchive(
    runId: string,
  ): Promise<S3.GetObjectOutput> {
    const file = await this.storage.getObject(
      this.endpoints.getSimulationRunOutputS3Path(runId),
    );
    return file;
  }

  public async extractSimulationArchive(id: string): Promise<string[]> {
    const file = this.endpoints.getSimulationRunCombineArchiveS3Path(id);
    const destination = this.endpoints.getSimulationRunContentFileS3Path(id);
    this.logger.debug(`Extracting ${file} to ${destination}`);
    const output = await this.storage.extractZipObject(file, destination);
    const locations = output.map((file) => file.Location);
    return locations;
  }

  public async uploadSimulationArchive(
    runId: string,
    file: Buffer | Readable,
  ): Promise<string> {
    const s3File = await this.storage.putObject(
      this.endpoints.getSimulationRunCombineArchiveS3Path(runId),
      file,
    );
    return s3File.Location;
  }

  public async deleteSimulationArchive(runId: string): Promise<void> {
    await this.storage.deleteObject(
      this.endpoints.getSimulationRunCombineArchiveS3Path(runId),
    );
  }
}
