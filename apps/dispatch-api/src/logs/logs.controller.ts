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
import { ApiExtraModels, ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
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
  @ApiOperation({
    summary: 'Get the logs of all simulation runs',
    description: 'Get the logs of all simulation runs',
  })
  @Get()
  public getAllLogs(): void {
    throw new NotImplementedException('Not Implemented');
  }
  
  @ApiOperation({
    summary: 'Delete the logs of all simulation runs',
    description: 'Delete the logs of all simulation runs',
  })
  @Delete()
  public deleteAllLogs(): void {
    throw new NotImplementedException('Not Implemented');
  }
  */

  @ApiOperation({
    summary: 'Get the log a simulation run',
    description: 'Get the log a simulation run',
  })
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
  @ApiOperation({
    summary: 'Download the log a simulation run',
    description: 'Download the log a simulation run',
  })
  @Get(':id/download')
  @ApiTags('Downloads')
  public downloadLogs(@Param() id: string): void {
    throw new NotImplementedException('Not Implemented');
  }
  */

  @ApiOperation({
    summary: 'Upload the log a simulation run',
    description: 'Upload the log a simulation run',
  })
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
  @ApiOperation({
    summary: 'Delete the log a simulation run',
    description: 'Delete the log a simulation run',
  })
  @Delete(':id')
  public deleteLogs(@Param() id: string): void {
    throw new NotImplementedException('Not Implemented');
  }

  @ApiOperation({
    summary: 'Modify the log a simulation run',
    description: 'Modify the log a simulation run',
  })
  @Patch(':id')
  public editLogs(): void {
    throw new NotImplementedException('Not Implemented');
  }

  @ApiOperation({
    summary: 'Replace the log a simulation run',
    description: 'Replace the log a simulation run',
  })
  @Put(':id')
  public replaceLogs(): void {
    throw new NotImplementedException('Not Implemented');
  }
  */
}
