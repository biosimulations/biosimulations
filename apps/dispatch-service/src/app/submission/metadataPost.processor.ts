import { SimulationRunService } from '@biosimulations/api-nest-client';
import { ArchiveMetadataContainer } from '@biosimulations/datamodel/api';
import { JobQueue, JobReturn } from '@biosimulations/messages/messages';

import { Processor, Process } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { firstValueFrom } from 'rxjs';

@Processor(JobQueue.metadataPost)
export class MetadataPostProcessor {
  private readonly logger = new Logger(MetadataPostProcessor.name);

  public constructor(private submit: SimulationRunService) {}

  @Process({ name: JobQueue.metadataPost, concurrency: 10 })
  private async process(job: Job): Promise<JobReturn<undefined>> {
    const data = job.data;
    const runId = data.runId;

    const children = await job.getChildrenValues();
    let metadata: ArchiveMetadataContainer | undefined;
    try {
      metadata = Object.keys(children)
        .filter((key) => key.includes(JobQueue.metadata))
        .map((key) => children?.[key])?.[0]?.data;
    } catch (e) {
      this.logger.error(e);
    }

    if (!metadata) {
      return {
        status: 'Failed',
        reason: 'Metadata not found',
        data: undefined,
      };
    }

    try {
      const metadataReq = this.submit.postMetadata(runId, metadata);

      //!!Leaving out this await will cause the job to always succeed regardless of the result of the promise
      await firstValueFrom(metadataReq);

      return {
        status: 'Succeeded',
        reason: 'Posted Metadata successfully',
        data: undefined,
      };
    } catch (e) {
      this.logger.error(e);
      if (job.attemptsMade < (job.opts.attempts || 0)) {
        throw e;
      }
      return {
        status: 'Failed',
        reason: 'Failed to post SED-ML specs',
        data: undefined,
      };
    }
  }
}
