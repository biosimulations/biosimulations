import {
  Injectable,
} from '@nestjs/common';
import path from 'path';

import { ConfigService } from '@nestjs/config';
import { FileModifiers } from '@biosimulations/dispatch/file-modifiers';

@Injectable()
export class AppService {
  constructor(

    private configService: ConfigService,
  ) { }
  private fileStorage = this.configService.get<string>('hpc.fileStorage', '');

  async downloadLogFile(uId: string, download: boolean, res: any) {
    const logPath = path.join(this.fileStorage, 'simulations', uId, 'out');
    let filePathOut = '';
    let filePathErr = '';
    download = String(download) === 'false' ? false : true;

    if (download) {

      filePathErr = path.join(logPath, 'job.error');
      res.set('Content-Type', 'text/html');
      res.download(filePathErr);

    } else {

      filePathOut = path.join(logPath, 'job.output');
      filePathErr = path.join(logPath, 'job.error');
      const fileContentOut = (
        await FileModifiers.readFile(filePathOut)
      ).toString();
      const fileContentErr = (
        await FileModifiers.readFile(filePathErr)
      ).toString();
      res.set('Content-Type', 'application/json');
      res.send({
        message: 'Logs fetched successfully',
        data: {
          output: fileContentOut,
          error: fileContentErr,
        },
      });

    }
  }

  downloadResultArchive(uId: string, res: any) {
    const zipPath = path.join(
      this.fileStorage,
      'simulations',
      uId,
      `${uId}.zip`
    );
    res.download(zipPath);
  }
}
