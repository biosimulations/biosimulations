import { Injectable, Logger, Inject } from '@nestjs/common';
import { SshService } from '../ssh/ssh.service';
import { ClientProxy } from '@nestjs/microservices';
import { SimulationRunStatus } from '@biosimulations/dispatch/api-models';
import { ConfigService } from '@nestjs/config';
import { SbatchService } from '../sbatch/sbatch.service';
import { urls } from '@biosimulations/config/common';

@Injectable()
export class HpcService {
  private logger = new Logger(HpcService.name);

  constructor(
    private readonly configService: ConfigService,
    private sshService: SshService,
    private sbatchService: SbatchService
  ) {}

  /**
   *
   * @param id
   * @param sbatchString
   */

  async submitJob(
    id: string,
    simulator: string,
    version: string,
    fileName: string
  ) {
    const simulatorString = `biosimulations_${simulator}_${version}.img`;
    const simDirBase = `${this.configService.get('hpc.hpcBaseDir')}/${id}`;

    const sbatchString = this.sbatchService.generateSbatch(
      simDirBase,
      simulatorString,
      fileName,
      urls.dispatchApi,
      id
    );
    return this.sshService.execStringCommand(
      `mkdir -p ${simDirBase}/in && mkdir -p ${simDirBase}/out && echo "${sbatchString}" > ${simDirBase}/in/${id}.sbatch && chmod +x ${simDirBase}/in/${id}.sbatch && sbatch ${simDirBase}/in/${id}.sbatch`
    );
  }

  async getJobStatus(jobId: string): Promise<SimulationRunStatus> {
    const saactData = await this.sshService
      .execStringCommand(`sacct -X -j ${jobId} -o state%20`)
      .catch((err) => {
        this.logger.error(
          'Failed to fetch results, updating the sim status as Pending, ' +
            JSON.stringify(err)
        );
        return { stdout: '\n\nPENDING' };
      });

    const saactDataOutput = saactData.stdout;
    // const saactDataError = saactData.stderr;
    const saactDataOutputSplit = saactDataOutput.split('\n');
    const finalStatusList = saactDataOutputSplit[2].split(' ');
    const finalStatus = finalStatusList[finalStatusList.length - 2];
    // Possible stdout's: PENDING, RUNNING, COMPLETED, CANCELLED, FAILED, TIMEOUT, OUT-OF-MEMORY,NODE_FAIL
    switch (finalStatus) {
      case 'PENDING' || '':
        return SimulationRunStatus.QUEUED;
      case 'RUNNING':
        return SimulationRunStatus.RUNNING;
      case 'COMPLETED':
        return SimulationRunStatus.SUCCEEDED;
      case 'FAILED' ||
        'OUT-OF-MEMORY' ||
        'NODE_FAIL' ||
        'TIMEOUT' ||
        'CANCELLED':
      default:
        return SimulationRunStatus.FAILED;
    }
  }
}
