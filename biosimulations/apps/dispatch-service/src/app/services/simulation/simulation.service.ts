import { Injectable } from '@nestjs/common';
import { HpcService } from '../hpc/hpc.service';
import { DispatchSimulationStatus } from '@biosimulations/dispatch/api-models';

@Injectable()
export class SimulationService {
  constructor(private hpcService: HpcService) {}

  async getSimulationStatus(jobId: string): Promise<DispatchSimulationStatus> {
    const jobStatus = await this.hpcService.saactJobStatus(jobId);
    return jobStatus;
  }
}
