import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class MonitoringService {
  constructor(@InjectQueue('jobmonitoring') private monitorQueue: Queue) {}
}
