import { Injectable } from '@nestjs/common';
import path from 'path';
import { HpcService } from '../hpc/hpc.service';
import { DispatchSimulationStatus } from '@biosimulations/dispatch/api-models';
import * as fs from 'fs';

@Injectable()
export class SimulationService {
  constructor(private hpcService: HpcService) {}

  async getSimulationStatus(uuid: string, jobId: string) {
    const file_storage = process.env.FILE_STORAGE || '';
    const simPath = path.join(file_storage, 'simulations', uuid, 'out');

    const jobStatus = await this.hpcService.squeueStatus(jobId);

    if (jobStatus === DispatchSimulationStatus.UNKNOWN) {
      // Get status by reading output and error files
      //   const outPath = `${simPath}/job.output`;
      const errPath = `${simPath}/job.error`;

      //   const outStr = await this.readFile(outPath);
      const errStr = await this.readFile(errPath);
      console.log(errStr)

      if (errStr !== '') {
        return DispatchSimulationStatus.FAILED;
      } else {
        return DispatchSimulationStatus.SUCCEEDED;
      }
    } else {
      return jobStatus;
    }
  }

  readFile(filePath: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      fs.readFile(filePath, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
}
