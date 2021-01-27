import { Injectable } from '@nestjs/common';
import { FileService } from './file.service';
import { promises as fsPromises } from 'fs';
import YAML from 'yaml';
import { SimulationRunService } from '@biosimulations/dispatch/nest-client';
import { CombineArchiveLog } from '@biosimulations/dispatch/api-models';
Injectable();
export class LogService {
  public constructor(
    private fileService: FileService,
    private submit: SimulationRunService,
  ) {}

  public async createLog(id: string): Promise<void> {
    const path = this.fileService.getResultsDirectory(id);
    return this.readLog(path).then((value) => this.uploadLog(id, value));
  }

  private async readLog(path: string): Promise<CombineArchiveLog> {
    const yamlFile = `${path}/log.yml`;
    const logFile = `${path}/job.out`;
    return fsPromises.readFile(yamlFile, 'utf8').then((file) => {
      const log = YAML.parse(file) as CombineArchiveLog;
      return fsPromises.readFile(logFile, 'utf8').then((stdout) => {
        if (log) {
          log.output = stdout;
        }
        return log;
      });
    });
  }

  private uploadLog(id: string, log: CombineArchiveLog): Promise<void> {
    return this.submit
      .sendLog(id, log)
      .toPromise()
      .then((_) => {
        return;
      });
  }
}
