import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  NotImplementedException,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CombineArchiveLog,
  SedPlot2DLog,
  SedPlot3DLog,
  SedReportLog,
  CreateSimulationRunLogBody,
  Exception,
} from '@biosimulations/dispatch/api-models';

import { LogsService } from './logs.service';
import { SimulationRunLogStatus } from '@biosimulations/datamodel/common';

@ApiExtraModels(SedReportLog, SedPlot2DLog, SedPlot3DLog)
@Controller('logs')
@ApiTags('Logs')
export class LogsController {
  private logger = new Logger(LogsController.name);

  // eslint-disable-next-line @typescript-eslint/no-parameter-properties
  public constructor(private service: LogsService) {}

  @Get()
  public getAllLogs(): void {
    throw new NotImplementedException('Not Implemented');
  }
  @Delete()
  public deleteAllLogs(): void {
    throw new NotImplementedException('Not Implemented');
  }
  @ApiResponse({
    type: CombineArchiveLog,
  })
  @Get(':id')
  public async getLogs(@Param('id') id: string): Promise<CombineArchiveLog> {
    const structLogs = await this.service.getLog(id);

    if (!structLogs) {
      let logString = '';
      let exception: Exception | null = null;
      try {
        const oldLog = await this.service.getOldLogs(id);
        logString = oldLog.output + oldLog.error;
      } catch (e) {
        exception = {
          category: 'Old Simulation',
          message:
            'This simulation does not have a log available.\
             Please re-run the simulation',
        };
      }
      const log = await this.service.createLog(id, {
        sedDocuments: null,
        status: SimulationRunLogStatus.UNKNOWN,
        exception: exception,
        skipReason: null,
        duration: null,
        output: logString,
      });

      return log.log;
    }

    return structLogs;
  }

  @Get(':id/download')
  public downloadLogs(@Param() id: string): void {
    throw new NotImplementedException('Not Implemented');
  }

  @Post()
  public async createLogs(
    @Body() body: CreateSimulationRunLogBody,
  ): Promise<CombineArchiveLog> {
    this.logger.error('Creating Log');
    const logs = await this.service.createLog(body.simId, body.log);
    return logs.log;
  }

  @Delete(':id')
  public deleteLogs(@Param() id: string): void {
    throw new NotImplementedException('Not Implemented');
  }

  @Patch(':id')
  public editLogs(): void {
    throw new NotImplementedException('Not Implemented');
  }

  @Put(':id')
  public replaceLogs(): void {
    throw new NotImplementedException('Not Implemented');
  }
}
