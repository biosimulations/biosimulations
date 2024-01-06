import { Injectable, Logger } from '@nestjs/common';
import { SshService } from '../ssh/ssh.service';
import {
  SimulationRunStatus,
  SimulationRunStatusReason,
  EnvironmentVariable,
  Purpose,
} from '@biosimulations/datamodel/common';
import { ConfigService } from '@nestjs/config';
import { SbatchService } from '../sbatch/sbatch.service';

interface JobState {
  id: string;
  step: string;
  name: string;
  state: string;
}

@Injectable()
export class HpcService {
  private logger = new Logger(HpcService.name);

  public constructor(
    private readonly configService: ConfigService,
    private sshService: SshService,
    private sbatchService: SbatchService,
  ) {}

  /** Submit a job to an HPC queue to execute a COMBINE/OMEX archive
   * @param runId id of the simulation run
   * @param simulator BioSimulators id of the simulation tool (e.g., `tellurium`)
   * @param simulatorVersion version of the simulation tool (e.g., `2.2.1`)
   * @param cpus number of CPUs to request
   * @param memory amount of memory to request in GB
   * @param maxTime maximum amount of wall time to request in minutes
   * @param envVars values of environment variables to use to run the job
   * @param purpose purpose of the simulation run (e.g., academic research)
   * @param combineArchiveFilename filename of the COMBINE/OMEX archive to execute
   */
  public async submitJob(
    runId: string,
    simulator: string,
    simulatorVersion: string,
    cpus: number,
    memory: number,
    maxTime: number,
    envVars: EnvironmentVariable[],
    purpose: Purpose,
  ): Promise<{
    stdout: string;
    stderr: string;
  }> {
    const simDirname = `${this.configService.get('hpc.hpcBaseDir')}/${runId}`;

    const sbatchString = this.sbatchService.generateRunSimulationSbatch(
      runId,
      simulator,
      simulatorVersion,
      cpus,
      memory,
      maxTime,
      envVars,
      purpose,
      simDirname,
    );

    const sbatchFilename = `${simDirname}/job.sbatch`;
    // eslint-disable-next-line max-len
    const command = `mkdir -p ${simDirname} && { cat > ${sbatchFilename} << 'EOF'\n${sbatchString}\nEOF\n} && chmod +x ${sbatchFilename} && sbatch ${sbatchFilename}`;

    const res = this.sshService.execStringCommand(command);

    return res.catch((err) => {
      this.logger.error(`The job for simulation run '${runId}' could not be submitted.`);
      return {
        stdout: '',
        stderr: `The job for simulation run '${runId}' could not be submitted: ${err}`,
      };
    });
  }

  /** Get the status of a job for a simulation run
   * @param jobId id of the Slurm job
   */
  public async getJobStatus(jobId: string): Promise<SimulationRunStatusReason> {
    const delimiter = '|';
    const jobStatesStr = (
      await this.sshService
        .execStringCommand(
          `sacct --jobs ${jobId} --format jobid,jobname,state --noheader --parsable2 --delimiter "${delimiter}"`,
        )
        .catch((err) => {
          this.logger.error('Failed to fetch status update, ' + JSON.stringify(err));
          return { stdout: '' };
        })
    ).stdout.trim();
    let jobStatesArray!: JobState[];
    if (jobStatesStr) {
      jobStatesArray = jobStatesStr.split(/\n/).map((jobState: string): JobState => {
        const parts = jobState.split(delimiter);
        const iDot = parts[0].indexOf('.');
        const step = iDot === -1 ? '' : parts[0].substring(iDot + 1);
        return {
          id: parts[0],
          step: step,
          name: parts[1],
          state: parts[2],
        };
      });
    } else {
      jobStatesArray = [];
    }

    const jobStatesMap: { [step: string]: JobState } = {};
    jobStatesArray.forEach((jobState: JobState): void => {
      jobStatesMap[jobState.step] = jobState;
    });

    const finalStatus = jobStatesMap?.['']?.state || '';

    let simStatusReason: SimulationRunStatusReason;
    this.logger.debug(`Status of job '${jobId}' is '${finalStatus}'.`);
    // Can not use logical or in a switch statement.
    if (finalStatus == 'PENDING') {
      simStatusReason = {
        status: SimulationRunStatus.QUEUED,
        reason: 'Simulation run job is queued for execution.',
      };
    } else if (finalStatus == 'RUNNING') {
      simStatusReason = {
        status: SimulationRunStatus.RUNNING,
        reason: 'Simulation run job is executing.',
      };
    } else if (finalStatus == 'COMPLETED') {
      const failedSteps: string[] = [];
      jobStatesArray.forEach((jobState: JobState): void => {
        if (jobState.state !== 'COMPLETED') {
          failedSteps.push(`${jobState.name}: ${jobState.state}`);
        }
      });

      // if (failedSteps.length === 0) {
      simStatusReason = {
        status: SimulationRunStatus.SUCCEEDED,
        reason:
          'The simulation project (COMBINE/OMEX archive) was successfully saved, \
            the project executed successfully, and the results of the simulation experiments were successfully saved.',
      };
      // } else {
      //   simStatusReason = {
      //     status: SimulationRunStatus.FAILED,
      //     reason: `${failedSteps.length} steps of the simulation run job failed:\n  * ${failedSteps.join('\n  * ')}`,
      //   };
      //   this.logger.error(
      //     `Job '${jobId}' completed, but ${failedSteps.length} steps failed:\n  * ${failedSteps.join('\n  * ')}`,
      //   );
      // }
    } else if (
      finalStatus == 'FAILED' ||
      finalStatus == 'OUT-OF-MEMORY' ||
      finalStatus == 'NODE-FAIL' ||
      finalStatus == 'TIMEOUT' ||
      finalStatus == 'CANCELLED' ||
      finalStatus.startsWith('CANCELLED')
    ) {
      this.logger.error(`Job '${jobId}' failed with response of '${finalStatus}'.`);
      simStatusReason = {
        status: SimulationRunStatus.FAILED,
        reason: `Simulation run job terminated with status '${finalStatus}'.`,
      };
    } else {
      this.logger.warn(`Job '${jobId}' does not have a status yet.`);
      simStatusReason = {
        status: null,
        reason: 'Simulation run job does not yet have a status.',
      };
    }

    return simStatusReason;
  }
}
