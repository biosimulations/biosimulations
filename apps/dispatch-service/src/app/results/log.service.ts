import { Injectable, Logger } from '@nestjs/common';

import YAML from 'yaml';
import { SimulationRunService } from '@biosimulations/api-nest-client';
import {
  CombineArchiveLog,
  SimulationRunLogStatus,
} from '@biosimulations/datamodel/common';
import { SshService } from '../services/ssh/ssh.service';
@Injectable()
export class LogService {
  private logger = new Logger(LogService.name);
  public constructor(
    private submit: SimulationRunService,
    private sshService: SshService,
  ) {}

  public async createLog(id: string, extraStdLog?: string, update=false): Promise<void> {
    const path = this.sshService.getSSHResultsDirectory(id);
    return this.makeLog(path, extraStdLog).then((value) => this.uploadLog(id, value, update));
  }

  private async makeLog(path: string, extraStdLog?: string): Promise<CombineArchiveLog> {
    const log = await this.readLog(path);
    const stdLog = await this.readStdLog(path) + (extraStdLog ? extraStdLog : '');

    log.output = stdLog;
    return log;
  }

  private async readLog(path: string): Promise<CombineArchiveLog> {
    const yamlFile = `${path}/log.yml`;
    return this.sshService
      .execStringCommand('cat ' + yamlFile)
      .then((output) => {
        if (output.stderr != '') {
          throw new Error('No log read');
        }
        return YAML.parse(output.stdout) as CombineArchiveLog;
      })
      .catch((_: any) => {
        return {
          status: SimulationRunLogStatus.UNKNOWN,
          sedDocuments: null,
          skipReason: null,
          exception: {
            message: 'No log.yml was outputted by the simulator',
            category: 'Not Found',
          },
          output: null,
          duration: null,
        };
      });
  }

  private async readStdLog(path: string): Promise<string> {
    const logFile = `${path}/job.output`;
    return this.sshService
      .execStringCommand('cat ' + logFile)
      .then((output) => output.stdout)
      .catch((_) => {
        this.logger.error(_);
        return '';
      });
  }

  private uploadLog(id: string, log: CombineArchiveLog, update=false): Promise<void> {
    return this.submit
      .sendLog(id, log, update)
      .toPromise()
      .then((_) => {
        this.logger.debug('Sent Log to API');
      })
      .catch((reason) => {
        this.logger.error(reason);
        throw reason;
      });
  }
}
