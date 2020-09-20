import { Injectable } from '@nestjs/common';
import path from 'path';
import { HpcService } from '../hpc/hpc.service';
import { DispatchSimulationStatus, FileModifiers } from '@biosimulations/dispatch/api-models';

@Injectable()
export class SimulationService {
  constructor(private hpcService: HpcService) {}

  async getSimulationStatus(uuid: string, jobId: string) {
    const fileStorage = process.env.FILE_STORAGE || '';
    const simPath = path.join(fileStorage, 'simulations', uuid, 'out');

    const jobStatus = await this.hpcService.squeueStatus(jobId);

    if (jobStatus === DispatchSimulationStatus.UNKNOWN) {
      // Get status by reading output and error files
      //   const outPath = `${simPath}/job.output`;
      const errPath = `${simPath}/job.error`;

      //   const outStr = await FileModifiers.readFile(outPath);
      const errStr = await FileModifiers.readFile(errPath);
      console.log(errStr);

      if (errStr !== '') {
        return DispatchSimulationStatus.FAILED;
      } else {
        return DispatchSimulationStatus.SUCCEEDED;
      }
    } else {
      return jobStatus;
    }
  }

}
