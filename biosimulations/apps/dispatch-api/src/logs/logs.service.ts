/**
 * @file  Reads the strucutred logs from the database. Reads older logs directly from the nfs disk
 * @author Bilal Shaikh
 * @copyright Biosimulations Team, 2020
 * @license MIT
 */
import { CombineArchiveLog } from '@biosimulations/dispatch/api-models';

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { SimulationRunLog } from './logs.model';
import { Model } from 'mongoose';
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
}
