import { JobQueue } from '@biosimulations/messages/messages';

import { Processor, Process, InjectQueue } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FlowProducer, Job, JobNode, Queue } from 'bullmq';

@Processor(JobQueue.clean)
export class CleanUpProcessor {
  private readonly logger = new Logger(CleanUpProcessor.name);
  private flowProducer: FlowProducer;
  public constructor(
    private configService: ConfigService,
    @InjectQueue(JobQueue.complete) private completeQueue: Queue,
  ) {
    const queuehost = this.configService.get('queue.host');
    const queueport = this.configService.get('queue.port');
    this.flowProducer = new FlowProducer({
      connection: { host: queuehost, port: queueport },
    });
  }

  @Process({ name: 'Cleanup', concurrency: 10 })
  private async handleJobCleanup(job: Job): Promise<void> {
    const data = job.data;
    const runId = data.runId;
    const queue = job.data.queueName;
    const flow = await this.flowProducer.getFlow({
      id: runId,
      queueName: queue,
    });
    if (flow) {
      await this.removeJobsInFlow(flow);
    }
  }
  private async removeJobsInFlow(flow: JobNode): Promise<void> {
    if (flow.children) {
      flow.children.forEach(async (child) => {
        await this.removeJobsInFlow(child);
      });
    }
    if (flow.job) {
      await flow.job.remove();
    }
  }
}
