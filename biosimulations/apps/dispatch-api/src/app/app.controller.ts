import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import {
  Controller,
  Inject,
  OnApplicationBootstrap,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Get,
  Param,
  Query,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiQuery,
  ApiTags,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import {
  SimulationDispatchSpec,
  OmexDispatchFile,
} from '@biosimulations/dispatch/api-models';
import { ModelsService } from './resources/models/models.service';
import { FileModifiers } from '@biosimulations/dispatch/file-modifiers';

@Controller()
export class AppController implements OnApplicationBootstrap {
  constructor(
    @Inject('DISPATCH_MQ') private messageClient: ClientProxy,
    private appService: AppService,
    private modelsService: ModelsService
  ) {}

  @ApiTags('Dispatch')
  @Post('dispatch')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ deprecated: true, summary: 'Dispatch a simulation job' })
  @ApiResponse({
    status: 201,
    description: 'Dispatch status',
    type: Object,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          description: 'Omex file to upload',
          format: 'binary',
        },
        simulator: {
          type: 'string',
          description: 'Simulator to use like COPASI/VCELL, etc',
        },
        simulatorVersion: {
          type: 'string',
          description:
            'Version of the selected simulator like 4.27.214/latest, etc',
        },
        authorEmail: {
          description: 'Provide an email for notifications',
          type: 'string',
        },
        nameOfSimulation: {
          description: 'Define a name for your simulation project',
          type: 'string',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: OmexDispatchFile,
    @Body() bodyData: SimulationDispatchSpec
  ): Promise<any> {
    return this.appService.uploadFile(file, bodyData);
  }

  @ApiTags('Downloads')
  @Get('download/result/:uuid')
  @ApiOperation({ deprecated: true, summary: 'Downloads result files' })
  @ApiResponse({
    status: 200,
    description: 'Download all results as zip archive',
    type: Object,
  })
  resultArchive(@Param('uuid') uId: string, @Res() res: any): void {
    return this.appService.downloadResultArchive(uId, res);
  }

  @ApiTags('Downloads')
  @Get('download/omex/:uuid')
  @ApiOperation({ summary: 'Download omex file', deprecated: true })
  @ApiResponse({
    status: 200,
    description: 'Download omex file',
    type: Object,
  })
  omexArchive(@Param('uuid') uId: string, @Res() res: any): void {
    return this.appService.downloadUserOmexArchive(uId, res);
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
    description: 'Get results structure (SEDMLS and TASKS)',
    type: Object,
  })
  async getResultStructure(@Param('uuid') uId: string): Promise<any> {
    return this.appService.getResultStructure(uId);
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
    @Query('task') task: string
  ): Promise<any> {
    return this.appService.getVisualizationData(uId, sedml, task, chart);
  }

  @ApiTags('Simulators')
  @Get('/simulators')
  @ApiOperation({
    summary: 'Gives Information about all simulators avialable from dockerHub',
  })
  @ApiResponse({
    status: 200,
    description: 'Get all simulators and their versions',
    type: Object,
  })
  @ApiQuery({ name: 'name', required: false })
  async getAllSimulatorVersion(
    @Query('name') simulatorName: string
  ): Promise<string[]> {
    return this.appService.getSimulators(simulatorName);
  }

  // Enable cron when storage is out
  // @Cron('0 0 2 * * *')
  async deleteSimData() {
    const uuidObjects: {
      uuid: string;
    }[] = await this.modelsService.getOlderUuids();

    const uuids: string[] = [];

    for (const uuidObj of uuidObjects) {
      uuids.push(uuidObj.uuid);
    }

    for (const uuid of uuids) {
      const filePath = process.env.FILE_STORAGE;
      const uuidPath = `${filePath}/simulations/${uuid}`;
      FileModifiers.rmrfDir(uuidPath);
    }

    await this.modelsService.deleteSixOldData(uuids);
  }

  async onApplicationBootstrap() {
    await this.messageClient.connect();
  }
}
