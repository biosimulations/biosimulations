import {
  isSubmitFileSimulationRunJobData,
  isSubmitURLSimulationRunJobData,
  JobQueue,
  SubmitFileSimulationRunJobData,
  SubmitHPCSimulationRunJobData,
  SubmitURLSimulationRunJobData,
} from '@biosimulations/messages/messages';
import { InjectQueue, Process, Processor } from '@biosimulations/nestjs-bullmq';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bullmq';

@Processor(JobQueue.submitSimulationRun)
export class SubmissionProcessor {
  private readonly logger = new Logger(SubmissionProcessor.name);

  public constructor(
    @InjectQueue(JobQueue.dispatch)
    private dispatchQ: Queue<SubmitHPCSimulationRunJobData, void, JobQueue.dispatch>,
    @InjectQueue(JobQueue.resolveCombineArchive)
    private resolveQ: Queue<SubmitURLSimulationRunJobData, void, JobQueue.resolveCombineArchive>,
  ) {}

  @Process({ concurrency: 10 })
  public async handleSubmission(
    job: Job<SubmitFileSimulationRunJobData | SubmitURLSimulationRunJobData>,
    _token: string,
  ): Promise<void> {
    const data = job.data;
    const jobOptions = {
      attempts: 10,
      removeOnComplete: 100,
      removeOnFail: 100,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    };

    if (isSubmitURLSimulationRunJobData(data)) {
      this.logger.debug('Adding job to resolve archive');
      await this.resolveQ.add(JobQueue.resolveCombineArchive, data, jobOptions);
    } else if (isSubmitFileSimulationRunJobData(data)) {
      this.logger.debug('Adding job to HPC dispatch');
      await this.dispatchQ.add(JobQueue.dispatch, data, jobOptions);
    }
  }
}
