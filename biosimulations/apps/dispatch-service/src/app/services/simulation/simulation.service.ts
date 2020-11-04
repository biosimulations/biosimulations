import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import path from 'path';
import { HpcService } from '../hpc/hpc.service';
import { DispatchSimulationStatus } from '@biosimulations/dispatch/api-models';
import { FileModifiers } from '@biosimulations/dispatch/file-modifiers';

@Injectable()
export class SimulationService {
  private logger = new Logger(SimulationService.name);
  private fileStorage:string = this.configService.get(
    'hpc.fileStorage') || '';
  constructor(
    private hpcService: HpcService,
    private configService: ConfigService,
    ) { }

  async getSimulationStatus(uuid: string, jobId: string) {
    const simPath = path.join(this.fileStorage, 'simulations', uuid, 'out');

    const jobStatus = await this.hpcService.squeueStatus(jobId);

    if (jobStatus === DispatchSimulationStatus.UNKNOWN) {
      // Get status by reading output and error files
      //   const outPath = `${simPath}/job.output`;
      const errPath = `${simPath}/job.error`;

      //   const outStr = await FileModifiers.readFile(outPath);
      const errStr: Buffer = await FileModifiers.readFile(errPath);
      this.logger.log(errStr);

      if (errStr.toString() !== '') {
        this.logger.log('Sim failed');
        return DispatchSimulationStatus.FAILED;
      } else {
        this.logger.log('Sim succeeded');
        return DispatchSimulationStatus.SUCCEEDED;
      }
    } else {
      return jobStatus;
    }
  }
}
