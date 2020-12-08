import { Injectable } from '@nestjs/common';
import { HpcService } from '../hpc/hpc.service';
import {
  DispatchSimulationStatus,
  SimulationRunStatus,
} from '@biosimulations/dispatch/api-models';

/*
 * @todo do we need this wrapper?
 * @body @jonrkarr What is the intention of this wrapper around the hpc service?
 */
@Injectable()
export class SimulationService {
  constructor(private hpcService: HpcService) {}

  async getSimulationStatus(jobId: string): Promise<SimulationRunStatus> {
    const jobStatus = await this.hpcService.getJobStatus(jobId);
    return jobStatus;
  }
}
