import { CombineArchiveLog } from '@biosimulations/dispatch/api-models';
import {
  SimulationRunLogStatus,
  SimulationRunStatus,
} from '@biosimulations/datamodel/common';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileModifiers } from '@biosimulations/dispatch/file-modifiers';
import path from 'path';
import { InjectModel } from '@nestjs/mongoose';
import { SimulationRunLog } from './logs.model';
import { Model } from 'mongoose';

@Injectable()
export class LogsService {
  async createLog(
    id: string,
    data: CombineArchiveLog,
  ): Promise<SimulationRunLog> {
    const log = new this.logModel({
      simId: id,
      log: data,
    });

    return log.save();
  }
  constructor(
    private configService: ConfigService,
    @InjectModel(SimulationRunLog.name)
    private logModel: Model<SimulationRunLog>,
  ) {}
  private fileStorage = this.configService.get<string>('hpc.fileStorage', '');

  async getLog(id: string): Promise<CombineArchiveLog | null> {
    const log = await this.logModel.findOne({ simId: id }).exec();
    if (log) {
      return log.log;
    } else {
      return null;
    }
  }

  // TODO remove at some point, when sufficient number of older models have been converted.
  async getOldLogs(uId: string) {
    const logPath = path.join(this.fileStorage, 'simulations', uId, 'out');
    let filePathOut = '';
    let filePathErr = '';

    filePathOut = path.join(logPath, 'job.output');
    filePathErr = path.join(logPath, 'job.error');
    const fileContentOut = (
      await FileModifiers.readFile(filePathOut)
    ).toString();
    const fileContentErr = (
      await FileModifiers.readFile(filePathErr)
    ).toString();

    return {
      output: fileContentOut,
      error: fileContentErr,
    };
  }
}
