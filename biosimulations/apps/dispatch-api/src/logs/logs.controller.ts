import {
  Controller,
  Delete,
  Get,
  NotImplementedException,
  Param,
  Patch,
  Put
} from '@nestjs/common';
import { ApiExtraModels, ApiResponse } from '@nestjs/swagger';
import {
  CombineArchiveLog,
  SedPlot2DLog,
  SedPlot3DLog,
  SedReportLog
} from '@biosimulations/dispatch/api-models';

import { LogsService } from './logs.service';

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
    const structLogs = this.service.getMockLog(id);
    let rawLogs = {
      error: 'Sample Error',
      output: 'Sample Output'
    };
    try {
      rawLogs = await this.service.getOldLogs(id);
    } catch (e: any) {
      console.error('Can not read logs');
    }

    structLogs.output = rawLogs.output + rawLogs.error;
    return structLogs;
  }

  @Get(':id/download')
  downloadLogs(@Param() id: string) {
    throw new NotImplementedException('Not Implemented');
  }

  createLogs() {
    throw new NotImplementedException('Not Implemented');
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
