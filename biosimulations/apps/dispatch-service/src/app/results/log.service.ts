import { Injectable } from '@nestjs/common';
import { FileService } from './file.service';
import { promises as fsPromises } from 'fs';
import YAML from 'yaml';
import { SimulationRunService } from '@biosimulations/dispatch/nest-client';
Injectable();
export class LogService {
  public constructor(
    private fileService: FileService,
    private submit: SimulationRunService,
  ) {}

  public async createLog(id: string): Promise<void> {
    const path = `${this.fileService.getResultsDirectory(id)}/log.yml`;
    return this.uploadLog(id, path);
  }

  private uploadLog(id: string, path: string): Promise<void> {
    return fsPromises.readFile(path, 'utf8').then((file) => {
      const log = YAML.parse(file);
      return this.submit
        .sendLog(id, log)
        .toPromise()
        .then((_) => {
          return;
        });
    });
  }
}
