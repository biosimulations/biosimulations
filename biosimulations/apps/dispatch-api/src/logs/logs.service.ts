import { CombineArchiveLog } from '@biosimulations/dispatch/api-models';

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import { InjectModel } from '@nestjs/mongoose';
import { SimulationRunLog } from './logs.model';
import { Model } from 'mongoose';
import { promises as fsPromises } from 'fs';
@Injectable()
export class LogsService {
  private logger = new Logger(LogsService.name);
  private fileStorage = this.configService.get<string>('hpc.fileStorage', '');

  public constructor(
    private configService: ConfigService,
    @InjectModel(SimulationRunLog.name)
    private logModel: Model<SimulationRunLog>,
  ) {}

  public async createLog(
    id: string,
    data: CombineArchiveLog,
  ): Promise<SimulationRunLog> {
    const log = new this.logModel({
      simId: id,
      log: data,
    });

    return log.save();
  }

  public async getLog(id: string): Promise<CombineArchiveLog | null> {
    const log = await this.logModel.findOne({ simId: id }).exec();
    if (log) {
      return log.log;
    } else {
      return null;
    }
  }

  // TODO remove at some point, when sufficient number of older models have been converted.
  public async getOldLogs(uId: string): Promise<{ [key: string]: string }> {
    const logPath = path.join(this.fileStorage, 'simulations', uId, 'out');
    let filePathOut = '';
    let filePathErr = '';

    filePathOut = path.join(logPath, 'job.output');
    filePathErr = path.join(logPath, 'job.error');
    const fileContentOut = await fsPromises
      .readFile(filePathOut, 'utf-8')
      .catch((_: unknown) => {
        this.logger.error('Error reading std_out');
        this.logger.error(_);
        throw _;
      });

    const fileContentErr = await fsPromises
      .readFile(filePathErr, 'utf-8')
      .catch((_: unknown) => {
        this.logger.error('Error reading std_err');
        this.logger.error(_);
        return '';
      });

    return {
      output: fileContentOut,
      error: fileContentErr,
    };
  }
}
