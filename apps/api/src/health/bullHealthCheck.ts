import { Injectable, Logger } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import { InjectQueue, Processor } from '@nestjs/bullmq';
import { Job, Queue, QueueEvents } from 'bullmq';
import { JobQueue } from '@biosimulations/messages/messages';
import { ConfigService } from '@nestjs/config';

const JOB_NAME = 'healthCheck';
@Processor(JobQueue.health)
export class HealthCheckProcessor {
  // @Process(JOB_NAME)
  private async healthCheck(job: Job<any>): Promise<boolean> {
    return true;
  }
}

@Injectable()
export class BullHealthIndicator extends HealthIndicator {
  private queueEvents: QueueEvents;
  private logger = new Logger('BullHealthIndicator');
  public constructor(
    private configService: ConfigService,
    @InjectQueue(JobQueue.health) private readonly healthQueue: Queue,
  ) {
    super();
    const queueport = this.configService.get('queue.port');
    const queuehost = this.configService.get('queue.host');
    this.queueEvents = new QueueEvents(JobQueue.health, {
      connection: {
        host: queuehost,
        port: queueport,
      },
    });
  }

  public async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      const res = await this.healthQueue.add(
        JOB_NAME,
        {
          job: JOB_NAME,
        },
        {
          timeout: 1000,
          attempts: 1,
          removeOnComplete: 100,
          removeOnFail: 100,
        },
      );

      await res.waitUntilFinished(this.queueEvents);
      const status = await res.isCompleted();
      return this.getStatus(key, status);
    } catch (e) {
      throw new HealthCheckError((e as any)?.message, e);
    }
  }
}
