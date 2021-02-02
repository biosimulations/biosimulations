import { Injectable, Logger } from '@nestjs/common';
import { SshService } from '../ssh/ssh.service';
import { SimulationRunStatus } from '@biosimulations/datamodel/common';
import { ConfigService } from '@nestjs/config';
import { SbatchService } from '../sbatch/sbatch.service';

// TODO This service relies on knowledge of the sbatch script, and both use the same config vars. Should be refactored, or merged with sbatch service
@Injectable()
export class HpcService {
  private logger = new Logger(HpcService.name);

  constructor(
    private readonly configService: ConfigService,
    private sshService: SshService,
    private sbatchService: SbatchService,
  ) {}

  /**
   *
   * @param id
   * @param sbatchString
   */

  public async submitJob(
    id: string,
    simulator: string,
    version: string,
    fileName: string,
  ): Promise<{
    stdout: string;
    stderr: string;
  }> {
    const simulatorString = `docker://ghcr.io/biosimulators/${simulator}:${version}`;
    const simDirBase = `${this.configService.get('hpc.hpcBaseDir')}/${id}`;

    const endpoint = this.configService.get('urls.dispatchApi');

    const sbatchString = this.sbatchService.generateSbatch(
      simDirBase,
      simulatorString,
      fileName,
      endpoint,
      id,
    );

    // eslint-disable-next-line max-len
    const command = `mkdir -p ${simDirBase}/in && mkdir -p ${simDirBase}/out && echo "${sbatchString}" > ${simDirBase}/in/${id}.sbatch && chmod +x ${simDirBase}/in/${id}.sbatch && sbatch ${simDirBase}/in/${id}.sbatch`;

    const res = this.sshService.execStringCommand(command);

    return res.catch((err) => {
      console.error('Job Submission Failed');
      return { stdout: '', stderr: 'Failed to submit job' + err };
    });
  }

  public async getJobStatus(
    jobId: string,
  ): Promise<SimulationRunStatus | null> {
    const saactData = await this.sshService
      .execStringCommand(`sacct -X -j ${jobId} -o state -P | tail -1`)
      .catch((err) => {
        this.logger.error(
          'Failed to fetch status update, ' + JSON.stringify(err),
        );
        return { stdout: '' };
      });

    const saactDataOutput = saactData.stdout;
    const finalStatus = saactDataOutput.trim();

    this.logger.debug(`Job status is ${finalStatus}`);
    // Possible stdout's: PENDING, RUNNING, COMPLETED, CANCELLED, FAILED, TIMEOUT, OUT-OF-MEMORY,NODE_FAIL
    switch (finalStatus) {
      case 'PENDING': {
        return SimulationRunStatus.QUEUED;
      }

      case 'RUNNING': {
        return SimulationRunStatus.RUNNING;
      }

      case 'COMPLETED': {
        return SimulationRunStatus.PROCESSING;
      }

      case 'FAILED' ||
        'OUT-OF-MEMORY' ||
        'NODE_FAIL' ||
        'TIMEOUT' ||
        'CANCELLED': {
        this.logger.error(
          `Job ${jobId} failed with response of ${saactDataOutput}`,
        );
        return SimulationRunStatus.FAILED;
      }
      default: {
        this.logger.error(
          `Job ${jobId} status failed by default with response of ${saactDataOutput}`,
        );
        return null;
      }
    }
  }
}
