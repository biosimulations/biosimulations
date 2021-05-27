import { Injectable, Logger } from '@nestjs/common';

import { SimulationRunService } from '@biosimulations/dispatch/nest-client';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { FileService } from './file.service';
import { SshService } from '../services/ssh/ssh.service';

@Injectable()
export class ArchiverService {
  private logger = new Logger('ArchiverService');

  public constructor(
    private fileService: FileService,
    private sshService: SshService,
    private service: SimulationRunService,
  ) {}

  public async updateResultsSize(id: string): Promise<void> {
    const path = this.fileService.getSSHResultsDirectory(id);
    const archive = `${path}/${id}.zip`;
    const command = `du -b ${archive} | cut -f1`;
    this.sshService.execStringCommand(command).then((output) => {
      this.service
        .updateSimulationRunResultsSize(id, parseInt(output.stdout))
        .pipe(
          catchError((err, caught) => {
            this.logger.error(err);
            return of(null);
          }),
        )
        .subscribe();
    });
  }
}
