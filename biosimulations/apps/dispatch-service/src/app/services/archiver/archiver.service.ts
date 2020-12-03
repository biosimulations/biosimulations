import { ModelsService } from './../../resources/models/models.service';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@angular/core';
import { Logger } from '@nestjs/common';
import archiver from 'archiver';
import * as fs from 'fs';
import path from 'path';

@Injectable()
export class ArchiverService {
  constructor(
    private modelsService: ModelsService,
    private configService: ConfigService,) { }
  private logger = new Logger('ArchiverService');
  private fileStorage: string = this.configService.get(
    'hpc.fileStorage', '');

  async createResultArchive(uuid: string) {
    const resultPath = path.join(this.fileStorage, 'simulations', uuid, 'out');
    const simPath = path.join(this.fileStorage, 'simulations', uuid);
    const output = fs.createWriteStream(path.join(simPath, uuid + '.zip'));
    const archive = archiver('zip');

    output.on('close', () => {
      const size = archive.pointer().toString();
      this.modelsService.updateResultsSize(uuid, parseInt(size));
      this.logger.log(size + ' total bytes');
      this.logger.log(
        'archiver has been finalized and the output file descriptor has closed.'
      );
    });

    archive.on('error', (err) => {
      throw err;
    });

    archive.pipe(output);

    archive.directory(resultPath, false);
    await archive.finalize();
  }
}
