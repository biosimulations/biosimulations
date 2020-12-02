import { Injectable } from '@nestjs/common';
import { HpcService } from '../hpc/hpc.service';
import { MQDispatch } from '@biosimulations/messages/messages';
import { MessagePattern } from '@nestjs/microservices';

@Injectable()
export class SimulationService {
  constructor(
    private hpcService: HpcService,
  ) { }

  async getSimulationStatus(jobId: string) {
    const jobStatus = await this.hpcService.saactJobStatus(jobId);
    return jobStatus;
  }
}
