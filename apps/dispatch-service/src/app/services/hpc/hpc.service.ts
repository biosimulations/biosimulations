import { Injectable, Logger } from '@nestjs/common';
import { SshService } from '../ssh/ssh.service';
import {
  SimulationRunStatus,
  EnvironmentVariable,
  Purpose,
} from '@biosimulations/datamodel/common';
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
    cpus: number,
    memory: number,
    maxTime: number,
    envVars: EnvironmentVariable[],
    purpose: Purpose,
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
      cpus,
      memory,
      maxTime,
      envVars,
      purpose,
      fileName,
      endpoint,
      id,
    );

    // eslint-disable-next-line max-len
    const command = `mkdir ${simDirBase} && echo "${sbatchString}" > ${simDirBase}/${id}.sbatch && chmod +x ${simDirBase}/${id}.sbatch && sbatch ${simDirBase}/${id}.sbatch`;

    const res = this.sshService.execStringCommand(command);

    return res.catch((err) => {
      console.error('Job Submission Failed');
      return { stdout: '', stderr: 'Failed to submit job' + err };
    });
  }

  public async getJobStatus(
    jobId: string,
  ): Promise<SimulationRunStatus | null> {
    // TODO this needs to be changed everyime job srun changes. Need a better long term solution
    // TODO account for each step failing
    const saactData = await this.sshService
      .execStringCommand(`sacct -j ${jobId} -o state -P | tail -1`)
      .catch((err) => {
        this.logger.error(
          'Failed to fetch status update, ' + JSON.stringify(err),
        );
        return { stdout: '' };
      });

    const saactDataOutput = saactData.stdout;
    const finalStatus = saactDataOutput.trim();
    let simStatus: SimulationRunStatus | null;
    this.logger.debug(`Job status is ${finalStatus}`);
    // Can not use logical or in a switch statement.
    if (finalStatus == 'PENDING') {
      simStatus = SimulationRunStatus.QUEUED;
    } else if (finalStatus == 'RUNNING') {
      simStatus = SimulationRunStatus.RUNNING;
    } else if (finalStatus == 'COMPLETED') {
      const stepStatus = (
        await this.sshService
          .execStringCommand(`sacct -j ${jobId}.1 -o state -P | tail -1`)
          .catch((err) => {
            this.logger.error(
              'Failed to fetch status update, ' + JSON.stringify(err),
            );
            return { stdout: '' };
          })
      ).stdout.trim();
      if (stepStatus == 'COMPLETED') {
        simStatus = SimulationRunStatus.PROCESSING;
      } else {
        simStatus = SimulationRunStatus.FAILED;
        this.logger.error(
          `Job ${jobId} completed, but simulation failed with response of ${stepStatus}`,
        );
      }
    } else if (
      finalStatus == 'FAILED' ||
      finalStatus == 'OUT-OF-MEMORY' ||
      finalStatus == 'NODE-FAIL' ||
      finalStatus == 'TIMEOUT' ||
      finalStatus == 'CANCELLED' ||
      finalStatus.startsWith('CANCELLED')
    ) {
      this.logger.error(`Job ${jobId} failed with response of ${finalStatus}`);
      simStatus = SimulationRunStatus.FAILED;
    } else if (finalStatus == 'State') {
      this.logger.warn(`Job ${jobId} does not have a status yet`);
      simStatus = null;
    } else {
      this.logger.error(
        `Job ${jobId} status failed by default with response of ${finalStatus}`,
      );
      simStatus = null;
    }
    return simStatus;
  }
}
