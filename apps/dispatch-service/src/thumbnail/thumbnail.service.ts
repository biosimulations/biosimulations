import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { FileService } from '../file/file.service';
import {
  THUMBNAIL_WIDTH,
  ThumbnailType,
} from '@biosimulations/config/common';
import sharp from 'sharp';
import { CombineArchiveManifestContent } from '@biosimulations/combine-api-nest-client';
import { SimulationStorageService } from '@biosimulations/shared/storage';
import { firstValueFrom, from, map, mergeMap, Observable } from 'rxjs';

@Injectable()
export class ThumbnailService {
  private static IMAGE_FORMAT_URIS = [
    'http://purl.org/NET/mediatypes/image/gif',
    'http://purl.org/NET/mediatypes/image/jpeg',
    'http://purl.org/NET/mediatypes/image/png',
    'http://purl.org/NET/mediatypes/image/webp',
  ];

  private logger = new Logger(ThumbnailService.name);

  public constructor(
    private fileService: FileService,
    private storage: SimulationStorageService,
  ) {}

  public async processThumbnails(runId: string) {
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
                      return this.processThumbnail(runId, content).catch(
                        (error: any): string => {
                          return `${
                            content.location.path
                          }: ${this.getErrorMessage(error)}`;
                        },
                      );
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
  ): Promise<void> {
    const location = content.location.path;

    // download file
    const file = await firstValueFrom(
      this.storage.getSimulationRunContentFile(runId, location).pipe(
        map((file) => {
          if (file) {
            return this.makeThumbnail(runId, location, file as Buffer);
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
  ): Promise<void> {
    // resize and upload file
    await Promise.all(
      Object.entries(THUMBNAIL_WIDTH).map(
        async (typeWidth: [string, number]): Promise<void> => {
          const thumbnail = await sharp(file as Buffer)
            .resize({
              width: typeWidth[1],
              withoutEnlargement: true,
            })
            .toBuffer();

          // upload thumbnail
          await this.storage.uploadSimulationRunThumbnail(
            runId,
            location,
            typeWidth[0] as ThumbnailType,
            thumbnail,
          );
        },
      ),
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

  private filterImages(
    contents: CombineArchiveManifestContent[],
  ): CombineArchiveManifestContent[] {
    return contents.filter((content) => {
      return ThumbnailService.IMAGE_FORMAT_URIS.includes(content.format);
    });
  }
}
