/**
 * @file  Reads the strucutred logs from the database. Reads older logs directly from the nfs disk
 * @author Bilal Shaikh
 * @copyright Biosimulations Team, 2020
 * @license MIT
 */
import { CombineArchiveLog as ApiCombineArchiveLog } from '@biosimulations/datamodel/common';

import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import {
  SimulationRunLog,
  CombineArchiveLog as DbCombineArchiveLog,
  SedReportLog as DbSedReportLog,
  SedPlot2DLog as DbSedPlot2DLog,
  SedPlot3DLog as DbSedPlot3DLog,
} from './logs.model';
import { Model, LeanDocument } from 'mongoose';

@Injectable()
export class LogsService {
  private logger = new Logger(LogsService.name);
  private fileStorage = this.configService.get<string>('hpc.fileStorage', '');

  public constructor(
    private configService: ConfigService,
    @InjectModel(SimulationRunLog.name)
    private logModel: Model<SimulationRunLog>,
    @InjectModel(DbCombineArchiveLog.name)
    private validateModel: Model<DbCombineArchiveLog>,
  ) {}

  public async createLog(
    runId: string,
    apiLog: ApiCombineArchiveLog,
  ): Promise<DbCombineArchiveLog> {
    const log = new this.logModel({
      simId: runId,
      log: this.apiToDbCombineArchiveLog(apiLog),
    });

    const res: SimulationRunLog = await log.save();
    return this.dbToApiCombineArchiveLog(res);
  }

  public async getLog(
    runId: string,
    includeOutput = true,
  ): Promise<LeanDocument<ApiCombineArchiveLog>> {
    const projection: any = {
      'log.sedDocuments.outputs._type': 0,
    };
    if (!includeOutput) {
      projection['log.output'] = 0;
      projection['log.sedDocuments.output'] = 0;
      projection['log.sedDocuments.tasks.output'] = 0;
      projection['log.sedDocuments.outputs.output'] = 0;
    }

    const log = await this.logModel
      .findOne({ simId: runId }, projection)
      .lean()
      .exec();

    if (!log) {
      throw new NotFoundException(`No log exists for simulation run ${runId}`);
    }

    return log.log;
  }

  public async replaceLog(
    runId: string,
    apiLog: ApiCombineArchiveLog,
  ): Promise<ApiCombineArchiveLog> {
    const log = await this.logModel.findOne({ simId: runId }).exec();

    if (!log) {
      throw new NotFoundException(`No log exists for simulation run ${runId}`);
    }

    log.overwrite({
      simId: runId,
      log: this.apiToDbCombineArchiveLog(apiLog),
    });
    const res = await log.save();
    return this.dbToApiCombineArchiveLog(res);
  }

  public async deleteLog(runId: string): Promise<ApiCombineArchiveLog> {
    const projection: any = {
      'log.sedDocuments.outputs._type': 0,
    };
    const log = await this.logModel
      .findOne({ simId: runId }, projection)
      .lean()
      .exec();

    if (!log) {
      throw new NotFoundException(`No log exists for simulation run ${runId}`);
    }
    const deleted = await this.logModel
      .findOneAndDelete({ simId: runId })
      .exec();

    return log.log;
  }

  public validateLog(apiLog: ApiCombineArchiveLog): Promise<void> {
    const log = new this.validateModel(this.apiToDbCombineArchiveLog(apiLog));
    return log.validate();
  }

  private apiToDbCombineArchiveLog(apiLog: any): any {
    if (!(apiLog instanceof Object)) {
      return apiLog;
    }

    const dbLog: any = {};
    Object.assign(dbLog, apiLog);
    dbLog.exception = this.apiToDbException(apiLog.exception);
    dbLog.skipReason = this.apiToDbException(apiLog.skipReason);
    if (Array.isArray(apiLog.sedDocuments)) {
      dbLog.sedDocuments = apiLog.sedDocuments.map(
        this.apiToDbSedDocumentLog.bind(this),
      );
    }
    return dbLog;
  }

  private apiToDbSedDocumentLog(apiLog: any): any {
    if (!(apiLog instanceof Object)) {
      return apiLog;
    }

    const dbLog: any = {};
    Object.assign(dbLog, apiLog);
    dbLog.exception = this.apiToDbException(apiLog.exception);
    dbLog.skipReason = this.apiToDbException(apiLog.skipReason);

    if (Array.isArray(apiLog.tasks)) {
      dbLog.tasks = apiLog.tasks.map(this.apiToDbSedTaskLog.bind(this));
    }

    if (Array.isArray(apiLog.outputs)) {
      dbLog.outputs = apiLog.outputs.map(
        this.apiToDbSedOutputLog.bind(this),
      ) as (DbSedReportLog | DbSedPlot2DLog | DbSedPlot3DLog)[];
    }

    return dbLog;
  }

  private apiToDbSedTaskLog(apiLog: any): any {
    if (!(apiLog instanceof Object)) {
      return apiLog;
    }

    const dbLog: any = {};
    Object.assign(dbLog, apiLog);
    dbLog.exception = this.apiToDbException(apiLog.exception);
    dbLog.skipReason = this.apiToDbException(apiLog.skipReason);
    if (Array.isArray(apiLog.simulatorDetails)) {
      dbLog.simulatorDetails = apiLog.simulatorDetails.map(
        this.apiToDbSimulatorDetail.bind(this),
      );
    }
    return dbLog;
  }

  private apiToDbSimulatorDetail(apiLog: any): any {
    if (!(apiLog instanceof Object)) {
      return apiLog;
    }

    const dbLog: any = {};
    Object.assign(dbLog, apiLog);
    return dbLog;
  }

  private apiToDbSedOutputLog(apiLog: any): any {
    if (!(apiLog instanceof Object)) {
      return apiLog;
    }

    if ('dataSets' in apiLog) {
      return this.apiToDbSedReportLog(apiLog);
    } else if ('curves' in apiLog) {
      return this.apiToDbSedPlot2DLog(apiLog);
    } else if ('surfaces' in apiLog) {
      return this.apiToDbSedPlot3DLog(apiLog);
    } else {
      throw new BadRequestException('A SED output log is invalid');
    }
  }

  private apiToDbSedReportLog(apiLog: any): any {
    const dbLog: any = {};
    Object.assign(dbLog, apiLog);
    dbLog._type = DbSedReportLog.name;
    dbLog.exception = this.apiToDbException(apiLog.exception);
    dbLog.skipReason = this.apiToDbException(apiLog.skipReason);
    if (Array.isArray(apiLog.dataSets)) {
      dbLog.dataSets = apiLog.dataSets.map(
        this.apiToDbSedOutputElementLog.bind(this),
      );
    }
    return dbLog;
  }

  private apiToDbSedPlot2DLog(apiLog: any): any {
    const dbLog: any = {};
    Object.assign(dbLog, apiLog);
    dbLog._type = DbSedPlot2DLog.name;
    dbLog.exception = this.apiToDbException(apiLog.exception);
    dbLog.skipReason = this.apiToDbException(apiLog.skipReason);
    if (Array.isArray(apiLog.curves)) {
      dbLog.curves = apiLog.curves.map(
        this.apiToDbSedOutputElementLog.bind(this),
      );
    }
    return dbLog;
  }

  private apiToDbSedPlot3DLog(apiLog: any): any {
    const dbLog: any = {};
    Object.assign(dbLog, apiLog);
    dbLog._type = DbSedPlot3DLog.name;
    dbLog.exception = this.apiToDbException(apiLog.exception);
    dbLog.skipReason = this.apiToDbException(apiLog.skipReason);
    if (Array.isArray(apiLog.surfaces)) {
      dbLog.surfaces = apiLog.surfaces.map(
        this.apiToDbSedOutputElementLog.bind(this),
      );
    }
    return dbLog;
  }

  private apiToDbSedOutputElementLog(apiLog: any): any {
    if (!(apiLog instanceof Object)) {
      return apiLog;
    }

    const dbLog: any = {};
    Object.assign(dbLog, apiLog);
    return dbLog;
  }

  private apiToDbException(apiException: any): any {
    if (!(apiException instanceof Object)) {
      return apiException;
    }

    const dbException: any = {};
    Object.assign(dbException, apiException);
    return dbException;
  }

  private dbToApiCombineArchiveLog(
    dbRunLog: SimulationRunLog,
  ): ApiCombineArchiveLog {
    const dbLog = dbRunLog.toObject().log;

    dbLog?.sedDocuments?.forEach((sedDocumentLog): void => {
      sedDocumentLog?.outputs?.forEach((outputLog): void => {
        if ('_type' in (outputLog as any)) {
          delete (outputLog as any)._type;
        }
      });
    });

    return dbLog as ApiCombineArchiveLog;
  }
}
