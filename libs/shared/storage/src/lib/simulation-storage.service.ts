import {
  Injectable,
  Logger,
  InternalServerErrorException,
  HttpStatus,
} from '@nestjs/common';
import S3 from 'aws-sdk/clients/s3';
import * as AWS from 'aws-sdk';
import { SharedStorageService } from './shared-storage.service';
import {
  FilePaths,
  ThumbnailType,
  THUMBNAIL_WIDTH,
} from '@biosimulations/config/common';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';

// hack to get typing to work see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/47780
// eslint-disable-next-line unused-imports/no-unused-imports-ts
import multer from 'multer';

@Injectable()
export class SimulationStorageService {
  private filePaths: FilePaths;
  private logger = new Logger(SimulationStorageService.name);

  public constructor(
    private storage: SharedStorageService,
    private configService: ConfigService,
  ) {
    const env = this.configService.get('server.env');
    this.filePaths = new FilePaths(env);
  }

  public async deleteSimulationRunResults(runId: string): Promise<void> {
    const s3path = this.filePaths.getSimulationRunOutputArchivePath(runId);
    await this.deleteS3Object(
      runId,
      s3path,
      `COMBINE archive could not be deleted for simulation run '{runId}'.`,
    );
  }

  public async deleteSimulationRunFile(
    runId: string,
    fileLocation: string,
  ): Promise<void> {
    const s3path = this.filePaths.getSimulationRunContentFilePath(
      runId,
      fileLocation,
    );

    await this.deleteS3Object(
      runId,
      s3path,
      `File '${fileLocation}' could not be deleted for simulation run '{runId}'.`,
    );

    // delete thumbnails
    await Promise.all(
      Object.keys(THUMBNAIL_WIDTH).map(
        async (thumbnailType: string): Promise<void> => {
          const s3thumbnailPath =
            this.filePaths.getSimulationRunContentFilePath(
              runId,
              fileLocation,
              thumbnailType as ThumbnailType,
            );

          await this.deleteS3Object(
            runId,
            s3thumbnailPath,
            `Thumbnail '${fileLocation}' could not be deleted for simulation run '{runId}'.`,
          ).catch((error: any) => {
            if (
              !(
                error.statusCode === HttpStatus.NOT_FOUND &&
                error.code === 'NoSuchKey'
              )
            ) {
              throw error;
            }
          });
        },
      ),
    );
  }

  public async getSimulationRunOutputArchive(
    runId: string,
  ): Promise<S3.GetObjectOutput> {
    const file = await this.storage.getObject(
      this.filePaths.getSimulationRunOutputArchivePath(runId),
    );
    return file;
  }

  public async getSimulationRunContentFile(
    runId: string,
    fileLocation: string,
  ): Promise<S3.GetObjectOutput> {
    const file = await this.storage.getObject(
      this.filePaths.getSimulationRunContentFilePath(runId, fileLocation),
    );
    return file;
  }

  public async extractSimulationArchive(id: string): Promise<string[]> {
    const file = this.filePaths.getSimulationRunCombineArchivePath(id);
    const destination = this.filePaths.getSimulationRunContentFilePath(id);
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
      this.filePaths.getSimulationRunCombineArchivePath(runId),
      file,
    );
    return s3File.Location;
  }

  public async uploadSimulationRunFile(
    runId: string,
    fileLocation: string,
    file: Buffer,
    thumbnailType?: ThumbnailType,
  ): Promise<void> {
    await this.storage.putObject(
      this.filePaths.getSimulationRunContentFilePath(
        runId,
        fileLocation,
        thumbnailType,
      ),
      file,
    );
  }

  public async deleteSimulationArchive(runId: string): Promise<void> {
    const s3path = this.filePaths.getSimulationRunCombineArchivePath(runId);
    await this.deleteS3Object(
      runId,
      s3path,
      `COMBINE archive could not be deleted for simulation run '{runId}'.`,
    );
  }

  public async deleteSimulation(runId: string): Promise<void> {
    const s3prefix = this.filePaths.getSimulationRunPath(runId, '');
    const s3paths: string[] =
      (await this.storage.listObjects(s3prefix))?.Contents?.flatMap(
        (Content): string[] => {
          if (Content?.Key) {
            return [Content.Key];
          } else {
            return [];
          }
        },
      ) || [];

    await Promise.all(
      s3paths.map(async (s3path: string): Promise<void> => {
        return this.deleteS3Object(
          runId,
          s3path,
          `COMBINE archive could not be deleted for simulation run '{runId}'.`,
        );
      }),
    );
  }

  private async deleteS3Object(
    runId: string,
    s3path: string,
    errorMessage: string,
    confirm = true,
  ): Promise<void> {
    // delete object
    const deletionResult: AWS.S3.DeleteObjectOutput =
      await this.storage.deleteObject(s3path);

    // confirm deletion operation was successful
    if (deletionResult.DeleteMarker !== true) {
      throw new InternalServerErrorException(errorMessage);
    }

    // confirm object no longer exists
    if (confirm) {
      await this.storage
        .getObject(s3path)
        .then((file: AWS.S3.GetObjectOutput): void => {
          throw new InternalServerErrorException(errorMessage);
        })
        .catch((error: any): void => {
          if (
            !(
              error.statusCode === HttpStatus.NOT_FOUND &&
              error.code === 'NoSuchKey'
            )
          ) {
            throw error;
          }
        });
    }
  }

  public async getFileProperties(
    s3path: string,
  ): Promise<AWS.S3.HeadObjectOutput> {
    return await this.storage.headObject(s3path);
  }
}
