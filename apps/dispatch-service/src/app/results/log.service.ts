import { Injectable, Logger } from '@nestjs/common';

import YAML from 'yaml';
import { CombineArchiveLog, SimulationRunLogStatus } from '@biosimulations/datamodel/common';

import { OutputFileName, SimulationStorageService } from '@biosimulations/shared/storage';
import { catchError, combineLatest, map, mergeMap, Observable, of } from 'rxjs';

@Injectable()
export class LogService {
  private logger = new Logger(LogService.name);

  public constructor(private storage: SimulationStorageService) {}

  public createLog(id: string, extraStdLog?: string): Observable<CombineArchiveLog> {
    const stdLog: Observable<string | undefined> = this.storage
      .getSimulationRunOutputFile(id, OutputFileName.RAW_LOG)
      .pipe(map((file) => (extraStdLog ? file?.toString('utf8') + extraStdLog : file?.toString('utf8'))));

    const structuredLog = this.storage
      // Get the simulation run structured log file from s3
      .getSimulationRunOutputFile(id, OutputFileName.LOG)
      .pipe(
        map((log) => {
          if (log) {
            const logString = log.toString('utf8');

            return YAML.parse(logString) as CombineArchiveLog;
          } else {
            // this will be caught right below
            throw new Error('Unable to parse log file');
          }
        }),
        catchError((err: any, caught) => {
          this.logger.error(`Failed to parse structured log for simulation run '${id}': ${err}`);
          // if there was an error, initialize a new structured log, and add an exception to it
          return of(this.initStructureLog()).pipe(
            map((log: CombineArchiveLog) => {
              log.exception = {
                message: 'The simulation tool did not produce a valid YAML-formatted log (`log.yml` file).',
                type: 'Invalid log',
              };
              return log;
            }),
          );
        }),
      );

    const finalLog = combineLatest([structuredLog, stdLog]).pipe(
      mergeMap((combineLogs) => {
        const [structuredLog, stdLog] = combineLogs;

        structuredLog.output = stdLog ?? '';
        return of(structuredLog);
      }),
    );

    return finalLog;
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
}
