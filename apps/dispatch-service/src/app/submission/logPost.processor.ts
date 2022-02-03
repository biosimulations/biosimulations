import { SimulationRunService } from '@biosimulations/api-nest-client';
import { CombineArchiveLog } from '@biosimulations/datamodel/common';

import { JobQueue, JobReturn } from '@biosimulations/messages/messages';

import { Processor, Process } from '@ejhayes/nestjs-bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { firstValueFrom } from 'rxjs';

@Processor(JobQueue.logsPost)
export class LogsPostProcessor {
  private readonly logger = new Logger(LogsPostProcessor.name);

  public constructor(private submit: SimulationRunService) {}

  @Process({ name: JobQueue.logsPost, concurrency: 10 })
  private async process(job: Job): Promise<JobReturn<undefined>> {
    const data = job.data;
    const runId = data.runId;

    const children = await job.getChildrenValues();
    let logs: CombineArchiveLog | undefined;

    try {
      logs = Object.keys(children)
        .filter((key) => key.includes('logs'))
        .map((key) => children?.[key])?.[0]?.data;
    } catch (e) {
      this.logger.error(e);
    }

    if (!logs) {
      this.logger.error(`No logs found for run ${runId}`);
      return {
        status: 'Failed',
        reason: 'logs not found',
        data: undefined,
      };
    }

    try {
      const logsReq = this.submit.sendLog(runId, logs);

      //!!Leaving out this await will cause the job to always succeed regardless of the result of the promise
      await firstValueFrom(logsReq);

      return {
        status: 'Succeeded',
        reason: 'Posted Logs successfully',
        data: undefined,
      };
    } catch (e) {
      this.logger.error(e);
      if (job.attemptsMade < (job.opts.attempts || 0)) {
        throw e;
      }

      return {
        status: 'Failed',
        reason: 'Failed to post Logs',
        data: undefined,
      };
    }
  }
}
