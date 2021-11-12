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

  public async createLog(
    id: string,
    tryPlainLog = true,
    extraStdLog?: string,
    update = false,
  ): Promise<void> {
    const path = this.sshService.getSSHResultsDirectory(id);
    return this.makeLog(id, path, true, extraStdLog).then((value) => {
      return this.uploadLog(id, value, update).catch((error) => {
        this.logger.error(
          `Log for simulation run '${id}' is invalid: ${error}.`,
        );
        if (tryPlainLog) {
          return this.makeLog(id, path, false, extraStdLog).then((value) => {
            return this.uploadLog(id, value, update);
          });
        } else {
          throw error;
        }
      });
    });
  }

  private async makeLog(
    id: string,
    path: string,
    makeStructuredLog = true,
    extraStdLog?: string,
  ): Promise<CombineArchiveLog> {
    const log = makeStructuredLog
      ? await this.readStructuredLog(path)
      : this.initStructureLog();
    const stdLog = (await this.readStdLog(id, path)) + (extraStdLog || '');

    log.output = stdLog;

    return log;
  }

  private async readStructuredLog(path: string): Promise<CombineArchiveLog> {
    const yamlFile = `${path}/log.yml`;

    return this.sshService
      .execStringCommand('cat ' + yamlFile)
      .then((output) => {
        if (output.stderr != '') {
          return this.initStructureLog();
        }
        return YAML.parse(output.stdout) as CombineArchiveLog;
      })
      .catch((_: any) => {
        const log = this.initStructureLog();
        log.exception = {
          message:
            'The simulation tool did not produce a valid YAML-formatted log (`log.yml` file).',
          type: 'Invalid log',
        };
        return log;
      });
  }

  private initStructureLog(): CombineArchiveLog {
    return {
      status: SimulationRunLogStatus.UNKNOWN,
      sedDocuments: null,
      skipReason: null,
      exception: null,
      output: null,
      duration: null,
    };
  }

  private async readStdLog(id: string, path: string): Promise<string> {
    const logFile = `${path}/job.output`;
    return this.sshService
      .execStringCommand('cat ' + logFile)
      .then((output) => output.stdout)
      .catch((reason) => {
        this.logger.error(
          `The job output for simulation run '${id}' could not be read: ${reason}`,
        );
        return '';
      });
  }

  private uploadLog(
    id: string,
    log: CombineArchiveLog,
    update = false,
  ): Promise<void> {
    return this.submit
      .sendLog(id, log, update)
      .toPromise()
      .then((_) => {
        this.logger.debug(
          `The log for simulation run '${id}' was successfully saved.`,
        );
      })
      .catch((reason) => {
        this.logger.error(
          `The log for simulation run '${id}' could not be ${
            update ? 'updated' : 'created'
          }: ${reason}`,
        );
        throw reason;
      });
  }
}
