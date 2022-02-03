import { CombineArchiveLog } from '@biosimulations/datamodel/common';
import { JobQueue, JobReturn } from '@biosimulations/messages/messages';
import { Processor, Process } from '@ejhayes/nestjs-bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { firstValueFrom } from 'rxjs';
import { LogService } from '../results/log.service';

@Processor(JobQueue.logs)
export class LogProcessor {
  private readonly logger = new Logger(LogProcessor.name);

  public constructor(private logService: LogService) {}

  @Process({ name: JobQueue.logs, concurrency: 10 })
  private async process(
    job: Job,
  ): Promise<JobReturn<CombineArchiveLog | undefined>> {
    const data = job.data;
    const runId = data.runId;
    try {
      const logProcessingResults = this.logService.createLog(runId);
      const logs = await firstValueFrom(logProcessingResults);
      return {
        status: 'Succeeded',
        data: logs,
        reason: 'Read logs Successfully',
      };
    } catch (e) {
      if (job.attemptsMade < (job.opts.attempts || 0)) {
        this.logger.warn('Log processing failed, retrying');
        throw e;
      } else {
        const message = `The log could not be created for runId ${runId}`;
        this.logger.error(message);
        job.log(message);
        const details = (e as Error).message;
        job.log(details);
        return {
          status: 'Failed',
          reason: 'The log could not be retrieved from the combine API',
          data: undefined,
        };
      }
    }
  }
}
