import { JobQueue, JobReturn } from '@biosimulations/messages/messages';
import { Processor, Process } from '@ejhayes/nestjs-bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { CombineArchiveManifestContent } from 'dist/libs/combine-api/nest-client/src';
import { firstValueFrom } from 'rxjs';
import { ManifestService } from '../../manifest/manifest.service';

@Processor(JobQueue.manifest)
export class ManifestProcessor {
  private readonly logger = new Logger(ManifestProcessor.name);

  public constructor(private manifestService: ManifestService) {}

  @Process({ name: 'manifest', concurrency: 10 })
  private async process(
    job: Job,
  ): Promise<JobReturn<CombineArchiveManifestContent[] | undefined>> {
    const data = job.data;
    const runId = data.runId;
    try {
      const contents = await firstValueFrom(
        this.manifestService.getManifestContent(runId),
      );
      
      job.updateProgress(100);
      return {
        status: 'Succeeded',
        data: contents,
        reason: 'Got manifest Successfully',
      };
    } catch (e) {
      this.logger.error(e);

      if (job.attemptsMade < (job.opts?.attempts || 0)) {
        throw e;
      } else {
        return {
          status: 'Failed',
          reason: 'The manifest of the file could not be found',
          data: undefined,
        };
      }
    }
  }
}
