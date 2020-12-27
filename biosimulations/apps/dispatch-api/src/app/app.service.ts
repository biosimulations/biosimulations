import { SimulationRunStatus } from '@biosimulations/dispatch/api-models';
import { SimulationRunModel } from './../simulation-run/simulation-run.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  HttpService,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import path from 'path';

import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';

import { FileModifiers } from '@biosimulations/dispatch/file-modifiers';

@Injectable()
export class AppService {
  constructor(
    @Inject('DISPATCH_MQ') private messageClient: ClientProxy,

    private configService: ConfigService,


  ) { }

  private fileStorage = this.configService.get<string>('hpc.fileStorage', '');
  private logger = new Logger(AppService.name);

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
