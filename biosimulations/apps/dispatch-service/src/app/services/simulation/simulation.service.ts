import { Injectable } from '@nestjs/common';
import { HpcService } from '../hpc/hpc.service';
import { MQDispatch } from '@biosimulations/messages';
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
<<<<<<< HEAD
=======

  @MessagePattern(MQDispatch.SIM_HPC_CANCEL)
  async cancelRunningSimulation(jobId: string) {
    return await this.hpcService.scancelJob(jobId);
  }
>>>>>>> 5caf5092 (Resizing plotly chart, working on job cancelling..)
}
