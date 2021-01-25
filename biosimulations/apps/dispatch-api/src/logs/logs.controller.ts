import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  NotImplementedException,
  Param,
  Patch,
  Post,
  Put
} from '@nestjs/common';
import { ApiExtraModels, ApiResponse } from '@nestjs/swagger';
import {
  CombineArchiveLog,
  SedPlot2DLog,
  SedPlot3DLog,
  SedReportLog,
  CreateSimulationRunLogBody,
  Exception
} from '@biosimulations/dispatch/api-models';

import { LogsService } from './logs.service';
import { SimulationRunLogStatus } from '@biosimulations/datamodel/common';

@ApiExtraModels(SedReportLog, SedPlot2DLog, SedPlot3DLog)
@Controller('logs/v2')
export class LogsController {
  constructor(private service: LogsService) {}

  @Get()
  getAllLogs() {
    throw new NotImplementedException('Not Implemented');
  }
  @Delete()
  deleteAllLogs() {
    throw new NotImplementedException('Not Implemented');
  }
  @ApiResponse({
    type: CombineArchiveLog
  })
  @Get(':id')
  async getLogs(@Param('id') id: string): Promise<CombineArchiveLog> {
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
            'This simulation does not have a log available due to its running date. Please re-run the simulation'
        };
      }
      const log = await this.service.createLog(id, {
        sedDocuments: null,
        status: SimulationRunLogStatus.UNKNOWN,
        exception: exception,
        skipReason: null,
        duration: null,
        output: logString
      });

      return log.log;
    }

    return structLogs;
  }

  @Get(':id/download')
  downloadLogs(@Param() id: string) {
    throw new NotImplementedException('Not Implemented');
  }

  @Post()
  async createLogs(
    @Body() body: CreateSimulationRunLogBody
  ): Promise<CombineArchiveLog> {
    const logs = await this.service.createLog(body.simId, body.log);
    return logs.log;
  }

  @Delete(':id')
  deleteLogs(@Param() id: string) {
    throw new NotImplementedException('Not Implemented');
  }

  @Patch(':id')
  editLogs() {
    throw new NotImplementedException('Not Implemented');
  }

  @Put(':id')
  replaceLogs() {
    throw new NotImplementedException('Not Implemented');
  }
}
