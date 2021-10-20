import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';

@Processor('health')
export class HealthCheckProcessor {
  @Process()
  private async healthCheck(job: Job<string>): Promise<boolean> {
    return false;
  }
}

@Injectable()
export class BullHealthIndicator extends HealthIndicator {
  public constructor(
    @InjectQueue('health') private readonly healthQueue: Queue,
  ) {
    super();
  }

  public async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      const res = await this.healthQueue.add(
        { key },
        { timeout: 1000, attempts: 1 },
      );
      console.log(res);
      const isHealthy = await res.finished();
    } catch (e) {
      throw new HealthCheckError('BullCheck failed', e.message);
    }
    return this.getStatus(key, true);
  }
}
