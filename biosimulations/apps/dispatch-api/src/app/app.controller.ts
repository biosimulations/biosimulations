import { ConfigService } from '@nestjs/config';
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
    private modelsService: ModelsService,
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
    @Query('report') report: string
  ): Promise<any> {
    return this.appService.getVisualizationData(uId, sedml, report, chart);
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
      const filePath = this.fileStorage;
      const uuidPath = `${filePath}/simulations/${uuid}`;
      FileModifiers.rmrfDir(uuidPath);
    }

    await this.modelsService.deleteSixOldData(uuids);
  }

  async onApplicationBootstrap() {
    await this.messageClient.connect();
  }
}
