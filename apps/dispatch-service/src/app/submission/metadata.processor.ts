import { ArchiveMetadataContainer } from '@biosimulations/datamodel/api';
import { JobQueue, JobReturn } from '@biosimulations/messages/messages';
import { Processor, Process } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { firstValueFrom } from 'rxjs';
import { MetadataService } from '../../metadata/metadata.service';

@Processor(JobQueue.metadata)
export class MetadataProcessor {
  private readonly logger = new Logger(MetadataProcessor.name);

  public constructor(private metadataService: MetadataService) {}

  @Process({ name: 'metadata', concurrency: 10 })
  private async process(job: Job): Promise<JobReturn<ArchiveMetadataContainer | undefined>> {
    const data = job.data;
    const runId = data.runId;

    try {
      const metadataProcessingResults = await firstValueFrom(this.metadataService.createMetadata(runId));
      job.updateProgress(100);
      return {
        status: 'Succeeded',
        data: metadataProcessingResults,
        reason: 'Got metadata successfully',
      };
    } catch (e) {
      this.logger.error(e);

      if (job.attemptsMade < (job.opts?.attempts || 0)) {
        throw e;
      } else {
        return {
          status: 'Failed',
          reason: 'The metadata of the file could not be found',
          data: undefined,
        };
      }
    }
  }
}
