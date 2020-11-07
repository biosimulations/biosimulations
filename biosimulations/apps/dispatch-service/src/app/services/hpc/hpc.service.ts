import { Injectable, Logger, Inject } from '@nestjs/common';
import { SshService } from '../ssh/ssh.service';
import { ClientProxy } from '@nestjs/microservices';
import { MQDispatch } from '@biosimulations/messages';
import { DispatchSimulationStatus } from '@biosimulations/dispatch/api-models';
import path from 'path';
import { stderr, stdout } from 'process';

@Injectable()
export class HpcService {
  private logger = new Logger(HpcService.name);

  constructor(
    // private readonly configService: ConfigService,
    private sshService: SshService,
    @Inject('DISPATCH_MQ') private messageClient: ClientProxy
  ) { }

  dispatchJob(
    simDirBase: string,
    sbatchPath: string,
    omexPath: string,
    omexName: string
  ) {
    const sbatchName = 'run.sbatch';

    this.logger.log('Omex name: ' + JSON.stringify(omexName));

    // get remote InDir and OutDir from config (ideally indir name should be simId)
    this.sshService
      .execStringCommand(`mkdir -p ${simDirBase}/in`)
      .then((value) => {
        this.logger.log(
          'Simdirectory created on HPC: ' + JSON.stringify(value)
        );

        this.sshService
          .putFile(omexPath, `${simDirBase}/in/${omexName}`)
          .then((val) => {
            this.logger.log(
              'Omex copying to HPC successful: ' + JSON.stringify(val)
            );
          })
          .catch((omexErr) => {
            this.logger.log(
              'Could not copy omex to HPC: ' + JSON.stringify(omexErr)
            );
          });

        this.sshService
          .putFile(sbatchPath, `${simDirBase}/in/${sbatchName}`)
          .then((res) => {
            this.logger.log(
              'SBATCH copying to HPC successful: ' + JSON.stringify(res)
            );
            this.sshService
              .execStringCommand(`chmod +x ${simDirBase}/in/${sbatchName}`)
              .then((resp) => {
                this.logger.log(
                  'Sbatch made executable: ' + JSON.stringify(resp)
                );

                this.sshService
                  .execStringCommand(`sbatch ${simDirBase}/in/${sbatchName}`)
                  .then((result) => {
                    this.logger.log(
                      'Execution of sbatch was successful: ' +
                      JSON.stringify(result)
                    );
                    this.messageClient.emit(MQDispatch.SIM_DISPATCH_FINISH, {
                      simDir: simDirBase,
                      hpcOutput: result,
                    });
                  })
                  .catch((error) => {
                    this.logger.log(
                      'Could not execute SBATCH: ' + JSON.stringify(error)
                    );
                  });
              })
              .catch((err) => {
                this.logger.log(
                  'Error occured whiled changing permission: ' +
                  JSON.stringify(err)
                );
              });
          })
          .catch((err) => {
            this.logger.log(
              'Could not copy SBATCH to HPC: ' + JSON.stringify(err)
            );
          });
      })
      .catch((err) => {
        this.logger.log(
          'Error occured while creating simdirectory: ' + JSON.stringify(err)
        );
      });

    this.sshService
      .execStringCommand(`mkdir -p ${simDirBase}/out`)
      .then((value) => {
        this.logger.log(
          'Output directory for simulation created: ' + JSON.stringify(value)
        );
      })
      .catch((err) => {
        this.logger.log(
          'Could not create output directory for simulation: ' +
          JSON.stringify(err)
        );
      });
  }


  async saactJobStatus(jobId: string) {

    const saactData = await this.sshService.execStringCommand(
      `sacct -X -j ${jobId} -o state%20`
    ).catch((err) => {
      this.logger.error('Failed to fetch results, updating the sim status as Pending, ' + JSON.stringify(err));
      return { stdout: '\n\nPENDING' }
    });

    const saactDataOutput = saactData.stdout;
    // const saactDataError = saactData.stderr;
    const saactDataOutputSplit = saactDataOutput.split("\n");
    const finalStatusList = saactDataOutputSplit[2].split(" ");
    const finalStatus = finalStatusList[finalStatusList.length - 2]
    // Possible stdout's: PENDING, RUNNING, COMPLETED, CANCELLED, FAILED, TIMEOUT, OUT-OF-MEMORY,NODE_FAIL
    switch (finalStatus) {
      case 'PENDING' || '':
        return DispatchSimulationStatus.QUEUED;
      case 'RUNNING':
        return DispatchSimulationStatus.RUNNING;
      case 'COMPLETED':
        return DispatchSimulationStatus.SUCCEEDED;
      // TODO: Implement Stop simulation functionality from user-end
      case 'CANCELLED':
        return DispatchSimulationStatus.CANCELLED;
      case 'FAILED' || 'OUT-OF-MEMORY' || 'NODE_FAIL' || 'TIMEOUT':
        return DispatchSimulationStatus.FAILED;
    }

  }

  
  async scancelJob(jobId: string): Promise<string | void | {}> {
    // TODO: Implement with non-root user
    const scancelJobData = await this.sshService.execStringCommand(
      `scancel ${jobId}`
    ).catch((error) => {
      this.logger.error('Cannot cancel the job, ' + JSON.stringify(error));
      return {
        stdout: stdout,
        stderror: stderr,
      }
    });
  }

}
