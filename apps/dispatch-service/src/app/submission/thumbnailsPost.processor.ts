import { SimulationRunService } from '@biosimulations/api-nest-client';
import {
  LocationThumbnailUrls,
  ThumbnailUrls,
} from '@biosimulations/datamodel/common';
import { JobQueue, JobReturn } from '@biosimulations/messages/messages';
import { Processor, Process } from '@biosimulations/nestjs-bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { firstValueFrom } from 'rxjs';

@Processor(JobQueue.thumbnailPost)
export class ThumbnailsPostProcessor {
  private readonly logger = new Logger(ThumbnailsPostProcessor.name);

  public constructor(private submit: SimulationRunService) {}

  @Process({ name: 'thumbnails', concurrency: 10 })
  private async process(
    job: Job,
  ): Promise<JobReturn<ThumbnailUrls[] | undefined>> {
    const data = job.data;
    const runId = data.runId;

    const children = await job.getChildrenValues();
    let thumbnails: LocationThumbnailUrls[] | undefined;

    try {
      thumbnails = Object.keys(children)
        .filter((key) => key.includes(JobQueue.thumbnailProcess))
        .map((key) => children[key])[0].data;
    } catch (e) {
      this.logger.error(e);
    }
    if (!thumbnails) {
      return {
        status: 'Failed',
        reason: 'Thumbnails not processed',
        data: undefined,
      };
    }

    try {
      const data = thumbnails.map(
        async (thumbnail: LocationThumbnailUrls): Promise<ThumbnailUrls> => {
          return await firstValueFrom(
            this.submit.putFileThumbnailUrls(
              runId,
              thumbnail.location,
              thumbnail.urls,
            ),
          );
        },
      );
      //!!Leaving out this await will cause the job to always succeed regardless of the result of the promise
      const resolvedData = await Promise.all(data);
      return {
        status: 'Succeeded',
        data: resolvedData,
        reason: 'Uploaded thumbnails Successfully',
      };
    } catch (e) {
      this.logger.error(e);
      if (job.attemptsMade < (job.opts?.attempts || 0)) {
        throw e;
      } else {
        return {
          status: 'Failed',
          reason: 'The thumbnails could not be created',
          data: undefined,
        };
      }
    }
  }
}
