import { HttpStatus, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import S3 from 'aws-sdk/clients/s3';
import * as AWS from 'aws-sdk';
import { SharedStorageService } from './shared-storage.service';
import { Thumbnail, THUMBNAIL_WIDTH, ThumbnailType } from '@biosimulations/datamodel/common';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';

// hack to get typing to work see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/47780
// eslint-disable-next-line unused-imports/no-unused-imports-ts
import { from, map, Observable, pluck } from 'rxjs';
import { FileInfo, OutputFileName } from './datamodel';
import { FilePaths } from './file-paths';

@Injectable()
export class SimulationStorageService {
  // TODO change to return Observables to make retrying

  private logger = new Logger(SimulationStorageService.name);

  public constructor(
    private storage: SharedStorageService,
    private configService: ConfigService,
    private filePaths: FilePaths,
  ) {}

  public async deleteSimulationRunResults(runId: string): Promise<void> {
    const s3path = this.filePaths.getSimulationRunOutputArchivePath(runId);
    await this.deleteS3Object(runId, s3path, `COMBINE/OMEX archive could not be deleted for simulation run '{runId}'.`);
  }

  public async deleteSimulationRunFile(runId: string, fileLocation: string): Promise<void> {
    const s3path = this.filePaths.getSimulationRunContentFilePath(runId, fileLocation);

    await this.deleteS3Object(
      runId,
      s3path,
      `File '${fileLocation}' could not be deleted for simulation run '{runId}'.`,
    );

    // delete thumbnails
    await Promise.all(
      Object.keys(THUMBNAIL_WIDTH).map(async (thumbnailType: string): Promise<void> => {
        const s3thumbnailPath = this.filePaths.getSimulationRunContentFilePath(
          runId,
          fileLocation,
          thumbnailType as Thumbnail,
        );

        await this.deleteS3Object(
          runId,
          s3thumbnailPath,
          `Thumbnail '${fileLocation}' could not be deleted for simulation run '{runId}'.`,
        ).catch((error: any) => {
          if (!(error.statusCode === HttpStatus.NOT_FOUND && error.code === 'NoSuchKey')) {
            throw error;
          }
        });
      }),
    );
  }

  public async getSimulationRunOutputArchive(runId: string): Promise<S3.GetObjectOutput> {
    const file = await this.storage.getObject(this.filePaths.getSimulationRunOutputArchivePath(runId));
    return file;
  }

  public getSimulationRunContentFile(
    runId: string,
    fileLocation: string,
    // TODO refine the return type to specify stream or buffer
  ): Observable<S3.Body | undefined> {
    const file = from(this.storage.getObject(this.filePaths.getSimulationRunContentFilePath(runId, fileLocation))).pipe(
      pluck('Body'),
    );

    return file;
  }

  public getSimulationRunContentFileInfo(runId: string, fileLocation: string): Observable<FileInfo> {
    const objectId = this.filePaths.getSimulationRunContentFilePath(runId, fileLocation);
    const url = this.filePaths.getSimulationRunFileContentEndpoint(runId, fileLocation);

    const size = from(this.storage.getObjectInfo(objectId)).pipe(
      map((info) => {
        const size = info.ContentLength;

        if (size) {
          return {
            size,
            url,
          };
        } else {
          this.logger.warn(`Could not get file size for ${objectId}`);
          return {
            size: undefined,
            url,
          };
        }
      }),
    );

    return size;
  }

  public getSimulationRunOutputFile(runId: string, file: OutputFileName): Observable<S3.Body | undefined> {
    return from(this.storage.getObject(this.filePaths.getSimulationRunOutputFilePath(runId, file, true))).pipe(
      pluck('Body'),
    );
  }
  public getSimulationRunOutputFileInfo(runId: string, file: OutputFileName): Observable<FileInfo> {
    const objectId = this.filePaths.getSimulationRunOutputFilePath(runId, file);

    const url = this.filePaths.getSimulationRunOutputFileEndpoint(runId, file);

    const size = from(this.storage.getObjectInfo(objectId)).pipe(
      map((info) => {
        const size = info.ContentLength;
        if (size) {
          return {
            size,
            url,
          };
        } else {
          this.logger.warn(`Could not get file size for ${objectId}`);
          return {
            size: undefined,
            url,
          };
        }
      }),
    );

    return size;
  }

  public async uploadSimulationArchive(runId: string, file: Buffer | Readable, length: number): Promise<string> {
    const s3File = await this.storage.putObject(
      this.filePaths.getSimulationRunCombineArchivePath(runId),
      file,
      false,
      length,
    );
    return this.filePaths.getSimulationRunCombineArchivePath(runId);
  }

  public async uploadSimulationRunThumbnail(
    runId: string,
    location: string,
    thumbnailType: ThumbnailType,
    thumbnail: Buffer,
  ): Promise<string> {
    const simulationRunContentFilePath = this.filePaths.getSimulationRunContentFilePath(runId, location, thumbnailType);
    const upload = await this.storage.putObject(simulationRunContentFilePath, thumbnail, false, thumbnail.length);
    return simulationRunContentFilePath;
  }
  public async uploadSimulationRunFile(runId: string, fileLocation: string, file: Buffer): Promise<void> {
    await this.storage.putObject(
      this.filePaths.getSimulationRunContentFilePath(runId, fileLocation),
      file,
      false,
      file.length,
    );
  }

  public async deleteSimulationArchive(runId: string): Promise<void> {
    const s3path = this.filePaths.getSimulationRunCombineArchivePath(runId);
    await this.deleteS3Object(runId, s3path, `COMBINE/OMEX archive could not be deleted for simulation run '{runId}'.`);
  }

  public async deleteSimulation(runId: string): Promise<void> {
    const s3prefix = this.filePaths.getSimulationRunPath(runId, '');
    const s3paths: string[] =
      (await this.storage.listObjects(s3prefix))?.Contents?.flatMap((Content): string[] => {
        if (Content?.Key) {
          return [Content.Key];
        } else {
          return [];
        }
      }) || [];

    await Promise.all(
      s3paths.map(async (s3path: string): Promise<void> => {
        return this.deleteS3Object(
          runId,
          s3path,
          `COMBINE/OMEX archive could not be deleted for simulation run '{runId}'.`,
        );
      }),
    );
  }

  private async deleteS3Object(runId: string, s3path: string, errorMessage: string, confirm = true): Promise<void> {
    // delete object
    const deletionResult: AWS.S3.DeleteObjectOutput = await this.storage.deleteObject(s3path);

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
          if (!(error.statusCode === HttpStatus.NOT_FOUND && error.code === 'NoSuchKey')) {
            throw error;
          }
        });
    }
  }
}
