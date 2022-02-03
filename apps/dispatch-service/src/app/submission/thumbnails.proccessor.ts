import { LocationThumbnailUrls } from '@biosimulations/datamodel/common';
import { JobQueue, JobReturn } from '@biosimulations/messages/messages';
import { Processor, Process } from '@ejhayes/nestjs-bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { ThumbnailService } from '../../thumbnail/thumbnail.service';

@Processor(JobQueue.thumbnailProcess)
export class ThumbnailsProcessor {
  private readonly logger = new Logger(ThumbnailsProcessor.name);

  public constructor(private thumbnailsService: ThumbnailService) {}

  @Process({ name: 'thumbnails', concurrency: 10 })
  private async process(job: Job): Promise<JobReturn<LocationThumbnailUrls[]>> {
    const data = job.data;
    const runId = data.runId;

    const children = await job.getChildrenValues();
    let files = null;

    try {
      files = Object.keys(children)
        .filter((key) => key.includes(JobQueue.files))
        .map((key) => children[key])[0].data;
    } catch (e) {
      this.logger.error(e);
    }
    if (!files) {
      return {
        status: 'Failed',
        reason: 'Files not found',
        data: [],
      };
    }

    try {
      const thumbnailUrls = await this.thumbnailsService.processThumbnails(
        runId,
        files,
      );
      return {
        status: 'Succeeded',
        data: thumbnailUrls,
        reason: 'Processed and saved thumbnails Successfully',
      };
    } catch (e) {
      this.logger.error(e);
      if (job.attemptsMade < (job.opts?.attempts || 0)) {
        throw e;
      } else {
        return {
          status: 'Failed',
          reason: 'The thumbnails could not be created',
          data: [],
        };
      }
    }
  }
}
