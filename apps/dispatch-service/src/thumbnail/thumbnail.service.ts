import { Injectable, Logger } from '@nestjs/common';

import {
  THUMBNAIL_WIDTH,
  ThumbnailType,
  ThumbnailUrls,
  THUMBNAIL_TYPES,
  IMAGE_FORMAT_URIS,
  LocationThumbnailUrls,
} from '@biosimulations/datamodel/common';
import sharp from 'sharp';

import { SimulationStorageService } from '@biosimulations/shared/storage';
import { firstValueFrom, map } from 'rxjs';
import { ProjectFile } from '@biosimulations/datamodel/api';

@Injectable()
export class ThumbnailService {
  private logger = new Logger(ThumbnailService.name);

  public constructor(private storage: SimulationStorageService) {}

  public async processThumbnails(runId: string, files: ProjectFile[]): Promise<LocationThumbnailUrls[]> {
    const manifestContent = this.filterImages(files);
    const thumbnailUrls = await Promise.all(
      manifestContent.map(async (content: ProjectFile): Promise<LocationThumbnailUrls> => {
        return await this.processThumbnail(runId, content);
      }),
    );

    return thumbnailUrls;
  }

  private async processThumbnail(runId: string, content: ProjectFile): Promise<LocationThumbnailUrls> {
    const location = content.location;

    // download file
    const file = await firstValueFrom(
      this.storage.getSimulationRunContentFile(runId, location).pipe(
        map(async (file) => {
          if (file) {
            const body = await this.makeThumbnail(runId, location, file as Buffer);
            const locationThumbs: LocationThumbnailUrls = {
              urls: body,
              location,
            };
            return locationThumbs;
          } else {
            throw new Error(`File ${location} not found`);
          }
        }),
      ),
    );
    return file;
  }

  private async makeThumbnail(runId: string, location: string, file: Buffer): Promise<ThumbnailUrls> {
    // resize and upload file

    const thumbnailUrls: ThumbnailUrls[] = await Promise.all(
      THUMBNAIL_TYPES.map(async (thumbnailType: ThumbnailType): Promise<ThumbnailUrls> => {
        const thumbnail = await sharp(file as Buffer)
          .resize({
            width: THUMBNAIL_WIDTH[thumbnailType],
            withoutEnlargement: true,
          })
          .toBuffer();

        // upload thumbnail
        const thumbnailUrl = await this.storage.uploadSimulationRunThumbnail(runId, location, thumbnailType, thumbnail);
        // enclosing var in [] uses the value of the var as key, not the name
        return { [thumbnailType]: thumbnailUrl };
      }),
    );

    const body: ThumbnailUrls = {};
    thumbnailUrls.forEach((element) => {
      Object.assign(body, element);
    });
    return body;
  }

  private filterImages(contents: ProjectFile[]): ProjectFile[] {
    return contents.filter((content) => {
      return IMAGE_FORMAT_URIS.includes(content.format);
    });
  }
}
