import { Injectable, Logger, Inject } from '@nestjs/common';
import { SshService } from '../ssh/ssh.service';
import { ClientProxy } from '@nestjs/microservices';
import { MQDispatch } from '@biosimulations/messages';
import { DispatchSimulationStatus } from '@biosimulations/dispatch/api-models';

@Injectable()
export class HpcService {
  private logger = new Logger(HpcService.name);

  constructor(
    // private readonly configService: ConfigService,
    private sshService: SshService,
    @Inject('DISPATCH_MQ') private messageClient: ClientProxy
  ) {}

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

  getOutputFiles(simId: string) {
    // pack all files (zip)
    // Get them on local
    // Unpack them and save to mongo
  }

  getRealtimeOutput(simId: string) {
    // Create a socket via SSH and stream the output file
  }

  async squeueStatus(jobId: string): Promise<DispatchSimulationStatus> {
    // Make SSH connection to HPC to check if job is running
    const squeueData = await this.sshService.execStringCommand(
      `squeue -j ${jobId} --start`
    );
    //TODO: Handle stderr as well
    const squeueJSON: any = this.parseSqueueOutput(squeueData.stdout);
    if (squeueJSON.length === 0) {
      return DispatchSimulationStatus.SUCCEEDED;
    } else {
      switch (squeueJSON[0]['ST']) {
        case 'PD':
          return DispatchSimulationStatus.QUEUED;
        case 'R':
          return DispatchSimulationStatus.RUNNING;
        case 'CG':
          return DispatchSimulationStatus.RUNNING;
        default:
          return DispatchSimulationStatus.FAILED;
      }
    }
    /* NOTE: For SLURM STATUS 'PD' means pending/queued
     'R' means running
    If jobinfo is not there, the job has completed/failed */
  }

  parseSqueueOutput(data: string): object[] {
    // Assumption: SqeueOutput is just special case of TSV

    const dataLineList = data.split('\n');

    const rows = [];

    for (const line of dataLineList) {
      const words = line.split(' ');
      const row = [];
      for (const word of words) {
        if (word !== '') {
          row.push(word);
        }
      }
      rows.push(row);
    }

    const headers = [...rows[0]];
    rows.splice(0, 1);

    const elementLength = headers.length;
    const rowsLength = rows.length;

    if (rowsLength === 0) {
      return [];
    }

    const finalResult = [];

    for (let rowIndex = 0; rowIndex < rowsLength; rowIndex++) {
      const currentObj: any = {};
      for (let elementIndex = 0; elementIndex < elementLength; elementIndex++) {
        currentObj[headers[elementIndex]] = rows[rowIndex][elementIndex];
      }
      finalResult.push(currentObj);
    }

    // console.log(headers)
    return finalResult;
  }
}
