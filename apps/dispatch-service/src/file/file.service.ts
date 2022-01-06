import { Endpoints, FilePaths, THUMBNAIL_WIDTH, ThumbnailType } from '@biosimulations/config/common';
import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

import { CombineWrapperService } from '../combineWrapper.service';
import {
  combineLatest,
  firstValueFrom,
  map,
  mergeMap,
  Observable,
  pluck,
  from,
} from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { CombineArchiveManifestContent } from '@biosimulations/combine-api-nest-client';
import { ProjectFileInput } from '@biosimulations/datamodel/api';
import { SimulationRunService } from '@biosimulations/api-nest-client';

import sharp from 'sharp';
import { SimulationStorageService } from '@biosimulations/shared/storage';
import S3 from 'aws-sdk/clients/s3';

interface ThumbnailSettledResult {
  thumbnail: string;
  success: boolean;
  error?: any;
}

@Injectable()
export class FileService {
  private logger = new Logger(FileService.name);
  private endpoints: Endpoints;
  private filePaths: FilePaths;

  private static IMAGE_FORMAT_URIS = [
    'http://purl.org/NET/mediatypes/image/gif',
    'http://purl.org/NET/mediatypes/image/jpeg',
    'http://purl.org/NET/mediatypes/image/png',
    'http://purl.org/NET/mediatypes/image/webp',
  ];

  public constructor(
    private config: ConfigService,
    private combine: CombineWrapperService,
    private httpService: HttpService,
    private submit: SimulationRunService,
    private storage: SimulationStorageService,
  ) {
    const env = config.get('server.env');
    this.endpoints = new Endpoints(env);
    this.filePaths = new FilePaths(env);
  }

  public async processFiles(id: string): Promise<void> {
    this.logger.log(`Processing files for simulation run '${id}'.`);
    const url = this.endpoints.getRunDownloadEndpoint(false, id);

    // get manifest
    const manifestContent = this.combine.getManifest(undefined, url).pipe(
      pluck('data'),
      pluck('contents'),
      shareReplay(1),
    )

    // save manifest
    await firstValueFrom(
      manifestContent.pipe(
        map((contents: CombineArchiveManifestContent[]) => {
          const apiFiles: Observable<ProjectFileInput>[] = contents
            .filter(
              (file: CombineArchiveManifestContent) =>
                file.location.path != '.',
            )
            .map((file: CombineArchiveManifestContent) => {
              const fileUrl =
                this.filePaths.getSimulationRunFileContentEndpoint(
                  false,
                  id,
                  file.location.path,
                );
              // This is a silly way to get the file size, but it works for now
              const apiFile = this.httpService.head(fileUrl).pipe(
                pluck('headers'),
                pluck('content-length'),
                map((size: string): ProjectFileInput => {
                  const fileSize = parseInt(size) || 0;
                  const fileObject: ProjectFileInput = {
                    id: id + '/' + file.location.path.replace('./', ''),
                    name: file.location.value.filename,
                    location: file.location.path.replace('./', ''),
                    size: fileSize,
                    format: file.format,
                    master: file.master,
                    url: fileUrl,
                  };
                  return fileObject;
                }),
              );
              return apiFile;
            });
          // Array of observables to observable of array
          return combineLatest(apiFiles);
        }),

        // collapse observables into one and post to API
        mergeMap((files: Observable<ProjectFileInput[]>) => {
          return files.pipe(
            map((files: ProjectFileInput[]) =>
              this.submit.postFiles(id, files),
            ),
          );
        }),
        mergeMap((files) => files),
      ),
    );

    // process thumbnails
    const errors = (await firstValueFrom(
      manifestContent.pipe(
        // filter out images
        map((contents: CombineArchiveManifestContent[]): CombineArchiveManifestContent[] => {
          return contents
            .filter((content: CombineArchiveManifestContent): boolean => {
              return FileService.IMAGE_FORMAT_URIS.includes(content.format);
            });
        }),

        // retrieve images, resize them, and save them
        map((contents: CombineArchiveManifestContent[]): Observable<(void | string)[]> => {
          return from(Promise.all(
            contents.map((content: CombineArchiveManifestContent): Promise<void | string> => {
              return this.processThumbnail(id, content)
                .catch((error: any): string => {
                  return `${content.location.path}: ${this.getErrorMessage(error)}`;
                });
            })
          ));
        }),
        mergeMap((contents) => contents),
      )
    ))
    .filter((error: void | string): boolean => {
      return typeof error === 'string';
    });

    if (errors.length) {
      const sortedErrors = Array.from(new Set(errors)).sort();
      const details = sortedErrors.join('\n  * ');
      throw new InternalServerErrorException(`Thumbnails could not be processed for ${sortedErrors.length} images:\n  * ${details}`);
    }

    return;
  }

  private async processThumbnail(runId: string, content: CombineArchiveManifestContent): Promise<void> {
    const location = content.location.path;

    // download file
    const file: S3.GetObjectOutput = await this.storage.getSimulationRunContentFile(runId, location);

    // resize and upload file
    await Promise.all(
      Object.entries(THUMBNAIL_WIDTH).map(
        async (typeWidth: [string, number]): Promise<void> => {
          const thumbnail = await sharp(file.Body as Buffer)
            .resize({ 
              width: typeWidth[1],
              withoutEnlargement: true,
            })
            .toBuffer();

          // upload thumbnail
          await this.storage.uploadSimulationRunFile(runId, location, thumbnail, typeWidth[0] as ThumbnailType);
        },
      )
    );
  }

  private getErrorMessage(error: any): string {
    let message: string;

    if (error?.isAxiosError) {
      message = `${error?.response?.status}: ${
        error?.response?.data?.detail || error?.response?.statusText
      }`;
    } else {
      message = `${error?.status || error?.statusCode}: ${error?.message}`;
    }

    return message.replace(/\n/g, '\n  ');
  }
}
