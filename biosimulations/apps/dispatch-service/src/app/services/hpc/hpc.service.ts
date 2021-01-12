import { Injectable, Logger, Inject } from '@nestjs/common';
import { SshService } from '../ssh/ssh.service';
import { ClientProxy } from '@nestjs/microservices';
import { SimulationRunStatus } from '@biosimulations/dispatch/api-models';
import { ConfigService } from '@nestjs/config';
import { SbatchService } from '../sbatch/sbatch.service';

// TODO This service relies on knowledge of the sbatch script, and both use the same config vars. Should be refactored, or merged with sbatch service
@Injectable()
export class HpcService {
  private logger = new Logger(HpcService.name);

  constructor(
    private readonly configService: ConfigService,
    private sshService: SshService,
    private sbatchService: SbatchService
  ) { }

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
  ): Promise<{
    stdout: string;
    stderr: string;
  }> {
    const simulatorString = `docker://ghcr.io/biosimulators/${simulator}:${version}`;
    const simDirBase = `${this.configService.get('hpc.hpcBaseDir')}/${id}`;

    const endpoint = this.configService.get('urls.dispatchApi')

    const sbatchString = this.sbatchService.generateSbatch(
      simDirBase,
      simulatorString,
      fileName,
      endpoint,
      id
    );

    const command = `mkdir -p ${simDirBase}/in && mkdir -p ${simDirBase}/out && echo "${sbatchString}" > ${simDirBase}/in/${id}.sbatch && chmod +x ${simDirBase}/in/${id}.sbatch && sbatch ${simDirBase}/in/${id}.sbatch`

    const res = this.sshService.execStringCommand(command)

    return res.catch(err => {
      console.error("Job Submission Failed")
      return { stdout: "", stderr: "Failed to submit job" + err }
    });
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
        return SimulationRunStatus.PROCESSING;
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
