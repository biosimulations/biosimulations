import { Injectable, Logger } from '@nestjs/common';
import { FileService } from './file.service';
import { promises as fsPromises } from 'fs';
import YAML from 'yaml';
import { SimulationRunService } from '@biosimulations/dispatch/nest-client';
import { CombineArchiveLog } from '@biosimulations/dispatch/api-models';
import { SimulationRunLogStatus } from '@biosimulations/datamodel/common';
@Injectable()
export class LogService {
  private logger = new Logger(LogService.name);
  public constructor(
    private fileService: FileService,
    private submit: SimulationRunService,
  ) {}

  public async createLog(id: string): Promise<void> {
    const path = this.fileService.getResultsDirectory(id);
    return this.makeLog(path).then((value) => this.uploadLog(id, value));
  }

  private async makeLog(path: string): Promise<CombineArchiveLog> {
    const log = await this.readLog(path);
    const stdLog = await this.readStdLog(path);

    log.output = stdLog;
    return log;
  }

  private async readLog(path: string): Promise<CombineArchiveLog> {
    const yamlFile = `${path}/log.yml`;
    return fsPromises
      .readFile(yamlFile, 'utf8')
      .then((file) => YAML.parse(file) as CombineArchiveLog)
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
    return fsPromises.readFile(logFile, 'utf8').catch((_) => {
      this.logger.error(_);
      return '';
    });
  }

  private uploadLog(id: string, log: CombineArchiveLog): Promise<void> {
    return this.submit
      .sendLog(id, log)
      .toPromise()
      .then((_) => {
        this.logger.debug('Sent Log to API');
      })
      .catch((reason) => this.logger.error(reason));
  }
}
