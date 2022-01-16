import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { FileService } from '../file/file.service';
import {
  THUMBNAIL_WIDTH,
  ThumbnailType,
  ThumbnailUrls,
  THUMBNAIL_TYPES,
  IMAGE_FORMAT_URIS,
} from '@biosimulations/datamodel/common';
import sharp from 'sharp';
import { CombineArchiveManifestContent } from '@biosimulations/combine-api-nest-client';
import { SimulationStorageService } from '@biosimulations/shared/storage';
import { firstValueFrom, from, map, mergeMap, Observable } from 'rxjs';
import { SimulationRunService } from '@biosimulations/api-nest-client';

@Injectable()
export class ThumbnailService {
  private logger = new Logger(ThumbnailService.name);

  public constructor(
    private fileService: FileService,
    private storage: SimulationStorageService,
    private submit: SimulationRunService,
  ) {}

  // TODO pick either observables or promises

  public async processThumbnails(
    runId: string,
    fileProcessingResults: Promise<void>,
  ): Promise<void> {
    const manifestContent = this.fileService.getManifestContent(runId);

    const errors = (
      await firstValueFrom(
        manifestContent.pipe(
          // filter out images
          map(
            (
              contents: CombineArchiveManifestContent[],
            ): CombineArchiveManifestContent[] => {
              return this.filterImages(contents);
            },
          ),

          // retrieve images, resize them, and save them
          map(
            (
              contents: CombineArchiveManifestContent[],
            ): Observable<(void | string)[]> => {
              return from(
                Promise.all(
                  contents.map(
                    (
                      content: CombineArchiveManifestContent,
                    ): Promise<void | string> => {
                      return this.processThumbnail(
                        runId,
                        content,
                        fileProcessingResults,
                      ).catch((error: any): string => {
                        return `${
                          content.location.path
                        }: ${this.getErrorMessage(error)}`;
                      });
                    },
                  ),
                ),
              );
            },
          ),
          mergeMap((contents) => contents),
        ),
      )
    ).filter((error: void | string): boolean => {
      return typeof error === 'string';
    });

    if (errors.length) {
      const sortedErrors = Array.from(new Set(errors)).sort();
      const details = sortedErrors.join('\n  * ');
      // TODO  This is an http exception, should not be thrown on the dispatch service. Use BioSimulationsException instead
      throw new InternalServerErrorException(
        `Thumbnails could not be processed for ${sortedErrors.length} images:\n  * ${details}`,
      );
    }

    return;
  }

  private async processThumbnail(
    runId: string,
    content: CombineArchiveManifestContent,
    fileProcessingResults: Promise<void>,
  ): Promise<void> {
    const location = content.location.path;

    // download file
    const file = await firstValueFrom(
      this.storage.getSimulationRunContentFile(runId, location).pipe(
        map(async (file) => {
          if (file) {
            const body = await this.makeThumbnail(
              runId,
              location,
              file as Buffer,
            );
            this.logger.log('wait for file processing to complete');
            await fileProcessingResults;
            this.logger.log(
              'File processing complete, submitting thumbnails URLs',
            );
            await firstValueFrom(
              this.submit.putFileThumbnailUrls(runId, location, body),
            );
          } else {
            throw new Error(`File ${location} not found`);
          }
        }),
      ),
    );
  }

  private async makeThumbnail(
    runId: string,
    location: string,
    file: Buffer,
  ): Promise<ThumbnailUrls> {
    // resize and upload file

    const thumbnailUrls: ThumbnailUrls[] = await Promise.all(
      THUMBNAIL_TYPES.map(
        async (thumbnailType: ThumbnailType): Promise<ThumbnailUrls> => {
          const thumbnail = await sharp(file as Buffer)
            .resize({
              width: THUMBNAIL_WIDTH[thumbnailType],
              withoutEnlargement: true,
            })
            .toBuffer();

          // upload thumbnail
          const thumbnailUrl = await this.storage.uploadSimulationRunThumbnail(
            runId,
            location,
            thumbnailType,
            thumbnail,
          );
          // enclosing var in [] uses the value of the var as key, not the name
          return { [thumbnailType]: thumbnailUrl };
        },
      ),
    );

    const body: ThumbnailUrls = {};
    thumbnailUrls.forEach((element) => {
      Object.assign(body, element);
    });
    return body;
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

  private filterImages(
    contents: CombineArchiveManifestContent[],
  ): CombineArchiveManifestContent[] {
    return contents.filter((content) => {
      return IMAGE_FORMAT_URIS.includes(content.format);
    });
  }
}
