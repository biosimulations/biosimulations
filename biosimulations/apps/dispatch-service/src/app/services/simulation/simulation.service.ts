import { Injectable } from '@nestjs/common';
import { HpcService } from '../hpc/hpc.service';

@Injectable()
export class SimulationService {
  constructor(
    private hpcService: HpcService,
  ) { }

  async getSimulationStatus(jobId: string) {
    const jobStatus = await this.hpcService.saactJobStatus(jobId);
    return jobStatus;
  }

  async cancelRunningSimulation(jobId: string) {
    return await this.hpcService.scancelJob(jobId);
  }
}
