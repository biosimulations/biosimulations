import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import {
  Controller,
  Inject,
  OnApplicationBootstrap,
  Get,
  Param,
  Query,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { FileModifiers } from '@biosimulations/dispatch/file-modifiers';
import { SimulationRunStatus } from '@biosimulations/dispatch/api-models';

@Controller()
export class AppController implements OnApplicationBootstrap {
  constructor(
    @Inject('DISPATCH_MQ') private messageClient: ClientProxy,
    private appService: AppService,

    private configService: ConfigService
  ) {}
  private fileStorage = this.configService.get<string>('hpc.fileStorage', '');

  @ApiTags('Downloads')
  @Get('download/result/:uuid')
  @ApiOperation({ deprecated: false, summary: 'Downloads result files' })
  @ApiResponse({
    status: 200,
    description: 'Download all results as zip archive',
    type: Object,
  })
  resultArchive(@Param('uuid') uId: string, @Res() res: any): void {
    return this.appService.downloadResultArchive(uId, res);
  }

  @ApiTags('Downloads')
  @Get('logs/:uuid')
  @ApiOperation({
    summary: 'Log file',
  })
  @ApiResponse({
    status: 200,
    description: 'Download or get response for log files',
    type: Object,
  })
  async downloadLogFile(
    @Param('uuid') uId: string,
    @Query('download') download: boolean,
    @Res() res: any
  ): Promise<void> {
    return this.appService.downloadLogFile(uId, download, res);
  }

  @ApiTags('Result')
  @Get('result/structure/:uuid')
  @ApiOperation({ summary: 'Shows result structure' })
  @ApiResponse({
    status: 200,
    description: `Get results structure (SED-ML'S and REPORTS)`,
    type: Object,
  })
  async getResultStructure(@Param('uuid') uId: string): Promise<any> {
    const jobStatus: string = await this.appService.jobStatusFromDb(uId);

    switch (jobStatus) {
      case SimulationRunStatus.SUCCEEDED:
        return this.appService.getResultStructure(uId);
      case SimulationRunStatus.QUEUED:
        return {
          message: `Simulation with ${uId} is queued, check again after some time.`,
        };
      case SimulationRunStatus.RUNNING:
        return {
          message: `Simulation with ${uId} is still running.`,
        };
      case SimulationRunStatus.FAILED:
        return {
          message: `Simulation with ${uId} failed, check the error logs.`,
        };
    }
  }

  @ApiTags('Result')
  @Get('result/:uuid')
  @ApiOperation({
    summary:
      'Get individual resultant JSON with or without chart data for each SED-ML and report ',
  })
  @ApiResponse({
    status: 200,
    description: 'Get Simulation Results',
    type: Object,
  })
  async getVisualizationData(
    @Param('uuid') uId: string,
    @Query('chart') chart: boolean,
    @Query('sedml') sedml: string,
    @Query('report') report: string
  ): Promise<any> {
    const jobStatus: string = await this.appService.jobStatusFromDb(uId);

    switch (jobStatus) {
      case SimulationRunStatus.SUCCEEDED:
        return this.appService.getVisualizationData(uId, sedml, report, chart);
      case SimulationRunStatus.QUEUED:
        return {
          message: `Simulation with ${uId} is queued, check again after some time.`,
        };
      case SimulationRunStatus.RUNNING:
        return {
          message: `Simulation with ${uId} is still running.`,
        };
      case SimulationRunStatus.FAILED:
        return {
          message: `Simulation with ${uId} failed, check the error logs.`,
        };
    }
  }

  async onApplicationBootstrap() {
    await this.messageClient.connect();
  }
}
