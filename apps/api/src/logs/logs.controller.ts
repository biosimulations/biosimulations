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
import {
  ApiExtraModels,
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import {
  CombineArchiveLog,
  SedPlot2DLog,
  SedPlot3DLog,
  SedReportLog,
  CreateSimulationRunLogBody,
} from '@biosimulations/datamodel/api';
import { ErrorResponseDocument } from '@biosimulations/datamodel/api';
// import { permissions } from '@biosimulations/auth/nest';
import { LogsService } from './logs.service';
import { permissions } from '@biosimulations/auth/nest';

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
  @ApiParam({
    name: 'runId',
    description: 'Id of the simulation run',
    required: true,
    type: String,
  })
  @ApiOkResponse({
    description: 'The log for a simulation run was sucessfully retrieved',
    type: CombineArchiveLog,
  })
  @ApiNotFoundResponse({
    description: 'No log exists for the requested simulation run id',
    type: ErrorResponseDocument,
  })
  @Get(':runId')
  public async getLogs(@Param('runId') id: string): Promise<CombineArchiveLog> {
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
  @Get(':runId/download')
  @ApiParam({
    name: 'runId',
    description: 'Id of the simulation run',
    required: true,
    type: String,
  })
  @ApiTags('Downloads')
  public downloadLogs(@Param() runId: string): void {
    throw new NotImplementedException('Not Implemented');
  }
  */

  @ApiOperation({
    summary: 'Save the log for a simulation run to the database',
    description: 'Save the log for a simulation run to the database',
  })
  @Post()
  @permissions('write:Logs')
  @ApiCreatedResponse({
    description: 'The logs for the simulation run were successfully saved',
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
