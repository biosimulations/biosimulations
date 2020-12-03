import { Injectable } from '@nestjs/common';
import { HpcService } from '../hpc/hpc.service';
import { SimulationStatus } from '@biosimulations/datamodel/common';

@Injectable()
export class SimulationService {
  constructor(private hpcService: HpcService) {}

  async getSimulationStatus(jobId: string): Promise<SimulationStatus> {
    const jobStatus = await this.hpcService.saactJobStatus(jobId);
    return jobStatus;
  }
}
