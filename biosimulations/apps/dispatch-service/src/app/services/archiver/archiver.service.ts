import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import archiver from 'archiver';
import * as fs from 'fs';
import path from 'path';
import { SimulationRunService } from '@biosimulations/dispatch/nest-client';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class ArchiverService {
  private logger = new Logger('ArchiverService');
  private fileStorage: string = this.configService.get('hpc.fileStorage', '');

  public constructor(
    private configService: ConfigService,
    private service: SimulationRunService,
  ) {}

  public async createResultArchive(uuid: string): Promise<void> {
    const resultPath = path.join(this.fileStorage, 'simulations', uuid, 'out');
    const simPath = path.join(this.fileStorage, 'simulations', uuid);
    const output = fs.createWriteStream(path.join(simPath, uuid + '.zip'));
    const archive = archiver('zip');

    output.on('close', () => {
      const size = archive.pointer().toString();
      this.service.updateSimulationRunResultsSize(uuid, parseInt(size)).pipe(catchError((err, caught) => {
        this.logger.error(err)
      return of(null)})).subscribe()
      this.logger.verbose(`The resulting archive holds ${size} bytes in size`);
      this.logger.log(
        'Archiver has been finalized and the output file descriptor has closed.',
      );
    });

    archive.on('error', (err) => {
      this.logger.log(`Error reading output for ${uuid}`);
      this.logger.log(err);
    });

    archive.pipe(output);

    archive.directory(resultPath, false);
    await archive.finalize();
  }
}
