import { JobQueue, JobReturn } from '@biosimulations/messages/messages';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { firstValueFrom } from 'rxjs';
import { ArchiverService } from '../results/archiver.service';

@Processor(JobQueue.output, { concurrency: 10 })
export class OutputProcessor extends WorkerHost {
  private readonly logger = new Logger(OutputProcessor.name);

  public constructor(private archiveService: ArchiverService) {
    super();
  }

  public async process(job: Job): Promise<JobReturn<number>> {
    const data = job.data;
    const runId = data.runId;
    try {
      const size = await firstValueFrom(this.archiveService.updateResultsSize(runId));

      if (!size) {
        throw new Error('Could not get size of archive');
      }

      job.updateProgress(100);
      return {
        status: 'Succeeded',
        data: size,
        reason: 'Got output successfully',
      };
    } catch (e) {
      this.logger.error(e);
      if (job.attemptsMade < (job.opts?.attempts || 0)) {
        throw e;
      } else {
        return {
          status: 'Failed',
          reason: 'The size could not be updated',
          data: 0,
        };
      }
    }
  }
}
