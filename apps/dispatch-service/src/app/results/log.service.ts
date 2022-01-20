import { Injectable, Logger } from '@nestjs/common';

import YAML from 'yaml';
import { SimulationRunService } from '@biosimulations/api-nest-client';
import {
  CombineArchiveLog,
  SimulationRunLogStatus,
} from '@biosimulations/datamodel/common';
import { SimulationStorageService } from '@biosimulations/shared/storage';
import { FilePaths } from '@biosimulations/shared/storage';

@Injectable()
export class LogService {
  private logger = new Logger(LogService.name);

  public constructor(
    private submit: SimulationRunService,
    private storage: SimulationStorageService,
    private filePaths: FilePaths,
  ) {}

  public async createLog(
    runId: string,
    tryPlainLog = true,
    extraStdLog?: string,
    update = false,
  ): Promise<CombineArchiveLog> {
    return this.makeLog(runId, true, extraStdLog).then((value) => {
      return this.uploadLog(runId, value, update).catch((error) => {
        this.logger.error(
          `Log for simulation run '${runId}' is invalid: ${error}.`,
        );
        if (!tryPlainLog) {
          throw error;
        }
        return this.makeLog(runId, false, extraStdLog).then((value) => {
          return this.uploadLog(runId, value, update);
        });
      });
    });
  }

  private async makeLog(
    runId: string,
    makeStructuredLog = true,
    extraStdLog?: string,
  ): Promise<CombineArchiveLog> {    
    const log = makeStructuredLog
      ? await this.readStructuredLog(runId)
      : this.initStructureLog();
    const stdLog = (await this.readStdLog(runId)) + (extraStdLog || '');

    log.output = stdLog;

    return log;
  }

  private async readStructuredLog(runId: string): Promise<CombineArchiveLog> {
    const location = this.filePaths.getSimulationRunLogPath(runId, true, false);
    return await this.storage
      .getSimulationRunFile<Buffer | string>(runId, location)
      .then((log: Buffer | string) => {
        log = log.toString('utf8');
        const structuredLog = YAML.parse(log) as CombineArchiveLog;
        return structuredLog;
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

  private async readStdLog(runId: string): Promise<string> {
    const location = this.filePaths.getSimulationRunLogPath(runId, false, false);
    return await this.storage
      .getSimulationRunFile<Buffer | string>(runId, location)
      .then((log: Buffer | string): string => {
        log = log.toString('utf8');
        return log;
      })
      .catch((error: any) => {
        this.logger.error(
          `The job output for simulation run '${runId}' could not be read: ${error}`,
        );
        return '';
      });
  }

  private uploadLog(
    runId: string,
    log: CombineArchiveLog,
    update = false,
  ): Promise<CombineArchiveLog> {
    return this.submit
      .sendLog(runId, log, update)
      .toPromise()
      .then((value) => {
        this.logger.log(
          `The log for simulation run '${runId}' was successfully saved.`,
        );
        return log;
      })
      .catch((reason) => {
        this.logger.error(
          `The log for simulation run '${runId}' could not be ${
            update ? 'updated' : 'created'
          }: ${reason}`,
        );
        throw reason;
      });
  }
}
