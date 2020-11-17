import { Injectable, Logger, Inject } from '@nestjs/common';
import { SshService } from '../ssh/ssh.service';
import { ClientProxy } from '@nestjs/microservices';
import { MQDispatch } from '@biosimulations/messages/messages';
import { DispatchSimulationStatus } from '@biosimulations/dispatch/api-models';
import path from 'path';
import { ConfigService } from '@nestjs/config';
import { SbatchService } from '../sbatch/sbatch.service';
import { urls } from '@biosimulations/config/common';
import { FileModifiers } from '@biosimulations/dispatch/file-modifiers';
@Injectable()
export class HpcService {
  private logger = new Logger(HpcService.name);

  constructor(
    private readonly configService: ConfigService,
    private sshService: SshService,
    private sbatchService: SbatchService,
    @Inject('DISPATCH_MQ') private messageClient: ClientProxy
  ) {}

  async dispatchJob(
    id: string,
    simulator: string,
    version: string,
    fileName: string
  ) {
    // Generate SBATCH script
    // TODO: Rename singularity images biosimulations_ to biosimulators_ on HPC and build new images according to /simulator from DB
    const simulatorString = `biosimulations_${simulator}_${version}`;
    const simDirBase = `${this.configService.get('hpc.hpcBaseDir')}/${id}`;
    const sbatchString = this.sbatchService.generateSbatch(
      simDirBase,
      simulatorString,
      fileName,
      urls.dispatchApi,
      id
    );

    const fileStorage: string = this.configService.get<string>(
      'hpc.fileStorage',
      ''
    );
    const sbatchStorage = `${fileStorage}/SBATCH/ID`;
    const sbatchName = `${id}.sbatch`;
    const sbatchPath = path.join(sbatchStorage, sbatchName);
    // Cab this be replaced with  this with fs.writefile? dont see the point of this wrapper
    await FileModifiers.writeFile(sbatchPath, sbatchString);

    /** @todo Send the sbatch over directly from string
     * @body @gmarupilla Does the sbatch need to be sent over as a file ? This is a lot of extra work.cant we just feed the string to the sbatch command ?
     */
    this.logger.log('SBatch path: ' + sbatchPath);
    // get remote InDir and OutDir from config (ideally indir name should be simId)
    this.sshService
      .execStringCommand(`mkdir -p ${simDirBase}/in`)
      .then((value) => {
        this.logger.log(
          'Simdirectory created on HPC: ' + JSON.stringify(value)
        );
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

  async saactJobStatus(jobId: string) {
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
}
