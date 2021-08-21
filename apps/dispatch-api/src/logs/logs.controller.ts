/**
 * @file Contains the controller for CRUD operations on simulation run logs
 * @author Bilal Shaikh
 * @copyright Biosimulations Team 2021
 * @license MIT
 */
import {
  Body,
  Controller,
  // Delete,
  Get,
  Logger,
  NotFoundException,
  // NotImplementedException,
  Param,
  // Patch,
  Post,
  // Put,
} from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CombineArchiveLog,
  SedPlot2DLog,
  SedPlot3DLog,
  SedReportLog,
  CreateSimulationRunLogBody,
} from '@biosimulations/dispatch/api-models';

import { LogsService } from './logs.service';

@ApiExtraModels(SedReportLog, SedPlot2DLog, SedPlot3DLog)
@Controller('logs')
@ApiTags('Logs')
export class LogsController {
  private logger = new Logger(LogsController.name);

  // eslint-disable-next-line @typescript-eslint/no-parameter-properties
  public constructor(private service: LogsService) {}

  /*
  @Get()
  public getAllLogs(): void {
    throw new NotImplementedException('Not Implemented');
  }
  @Delete()
  public deleteAllLogs(): void {
    throw new NotImplementedException('Not Implemented');
  }
  */
  @ApiResponse({
    status: 200,
    type: CombineArchiveLog,
  })
  @Get(':id')
  public async getLogs(@Param('id') id: string): Promise<CombineArchiveLog> {
    const structLogs = await this.service.getLog(id);

    if (!structLogs) {
      throw new NotFoundException('The logs were not found');
    }

    return structLogs;
  }

  /*
  @Get(':id/download')
  @ApiTags('Downloads')
  public downloadLogs(@Param() id: string): void {
    throw new NotImplementedException('Not Implemented');
  }
  */

  @Post()
  @ApiResponse({
    status: 201,
    type: CombineArchiveLog,
  })
  public async createLogs(
    @Body() body: CreateSimulationRunLogBody,
  ): Promise<CombineArchiveLog> {
    const logs = await this.service.createLog(body.simId, body.log);
    return logs.log;
  }

  /*
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
  */
}
