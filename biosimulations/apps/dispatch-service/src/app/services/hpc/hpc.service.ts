import { Injectable, Logger, Inject } from '@nestjs/common';
import { SshService } from '../ssh/ssh.service';
import { ClientProxy } from '@nestjs/microservices';
import { DispatchMessage, MQDispatch } from '@biosimulations/messages/messages';
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
  ) { }

  /**
   *
   * @param id
   * @param sbatchString
   */

  async execJob(
    id: string,
    simulator: string,
    version: string,
    fileName: string
  ) {

    const simulatorString = `biosimulations_${simulator}_${version}`;
    const simDirBase = `${this.configService.get('hpc.hpcBaseDir')}/${id}`;

    const sbatchString = this.sbatchService.generateSbatch(
      simDirBase,
      simulatorString,
      fileName,
      urls.dispatchApi,
      id
    );
    return this.sshService.execStringCommand(
      `mkdir -p ${simDirBase}/in && mkdir -p ${simDirBase}/out && echo "${sbatchString}" > ${simDirBase}/in/test.sbatch && chmod +x ${simDirBase}/in/test.sbatch && sbatch ${simDirBase}/in/test.sbatch`
    );
  }

  getOutputFiles(simId: string) {
    // pack all files (zip)
    // Get them on local
    // Unpack them and save to mongo
  }

  getRealtimeOutput(simId: string) {
    // Create a socket via SSH and stream the output file
  }

  async saactJobStatus(jobId: string): Promise<DispatchSimulationStatus> {
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
      default:
        return DispatchSimulationStatus.FAILED;
    }
  }
}
