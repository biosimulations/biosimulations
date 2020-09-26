import {
  Controller,
  Inject,
  OnApplicationBootstrap,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Logger,
  Get,
  Param,
  Query,
  HttpService,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import {
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiQuery,
  ApiProperty
} from '@nestjs/swagger';

import { v4 as uuid } from 'uuid';
import path from 'path';
import { urls } from '@biosimulations/config/common';
import { ModelsService } from './resources/models/models.service';
import {
  DispatchSimulationStatus,
  SimulationDispatchSpec,
  OmexDispatchFile,
  DispatchSimulationModel,
} from '@biosimulations/dispatch/api-models';
import { MQDispatch } from '@biosimulations/messages';
import { FileModifiers } from '@biosimulations/dispatch/api-models';
@Controller()
export class AppController implements OnApplicationBootstrap {
  private logger = new Logger(AppController.name);
  constructor(
    @Inject('DISPATCH_MQ') private messageClient: ClientProxy,
    private httpService: HttpService,
    private modelsService: ModelsService
  ) {}

  @Post('dispatch')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Dispatch a simulation job' })
  @ApiResponse({
    status: 201,
    description: 'Dispatch status',
    type: Object,
  })
  // TODO: Create a custom decorator for this and move to shared libs
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
  ): Promise<{}> {
    // TODO: Replace with fileStorage URL from configModule (BiosimulationsConfig)
    // TODO: Create the required folders automatically
    const fileStorage = process.env.FILE_STORAGE;
    const omexStorage = `${fileStorage}/OMEX/ID`;

    if (bodyData.simulator === '') {
      return { message: 'No Simulator was provided' };
    }

    // Get existing filetype
    // Generate a unique filename
    const fileId = uuid();
    const uniqueFilename = `${fileId}.omex`;
    const omexSavePath = path.join(omexStorage, uniqueFilename);

    // Fill out info from file that will be lost after saving in central storage
    const simSpec: SimulationDispatchSpec = {
      authorEmail: bodyData.authorEmail,
      nameOfSimulation: bodyData.nameOfSimulation,
      simulator: bodyData.simulator.toLowerCase(),
      simulatorVersion: bodyData.simulatorVersion,
      filename: file.originalname,
      uniqueFilename,
      filepathOnDataStore: omexSavePath,
    };

    // Save the file
    await FileModifiers.writeFile(omexSavePath, file.buffer);

    this.messageClient.send(MQDispatch.SIM_DISPATCH_START, simSpec).subscribe(
      (res) => {
        this.logger.log(JSON.stringify(res));
        const currentDateTime = new Date();
        const dbModel: DispatchSimulationModel = {
          uuid: fileId,
          authorEmail: simSpec.authorEmail,
          nameOfSimulation: simSpec.nameOfSimulation,
          submittedTime: currentDateTime,
          statusModifiedTime: currentDateTime,
          currentStatus: DispatchSimulationStatus.QUEUED,
          duration: 0,
        };

        this.modelsService.createNewDispatchSimulationModel(dbModel);
      },
      (err) => {
        this.logger.log(
          'Error occured in dispatch service: ' + JSON.stringify(err)
        );
      }
    );
    this.logger.log(
      'Dispatch message was sent successfully' + JSON.stringify(simSpec)
    );

    return {
      message: 'File uploaded successfuly',
      data: {
        id: fileId,
        filename: uniqueFilename,
      },
    };
  }

  @Get('download/:uuid')
  @ApiOperation({ summary: 'Downloads result files' })
  @ApiResponse({
    status: 200,
    description: 'Download all results as zip archive',
    type: Object,
  })
  archive(@Param('uuid') uId: string, @Res() res: any): void {
    const fileStorage = process.env.FILE_STORAGE || '';
    const zipPath = path.join(fileStorage, 'simulations', uId, `${uId}.zip`);
    res.download(zipPath);
  }

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
    const fileStorage = process.env.FILE_STORAGE || '';
    const logPath = path.join(fileStorage, 'simulations', uId, 'out');
    const simInfo = await this.modelsService.get(uId);

    //TODO: Nestjs is internally converting boolean query param to string, remove this workaround after fixed
    download = String(download) === 'false'? false: true

    if (simInfo === null) {
      res.send({ message: 'Cannot find the UUID specified' });
      // return {
      //   message: 'Cannot find the UUID specified',
      // };
    } else {
      let filePath: string = '';
      if (simInfo.currentStatus === DispatchSimulationStatus.SUCCEEDED) {
        filePath = path.join(logPath, 'job.output');
        console.log('Filepath: ', filePath);
        console.log('Download: ', download);
        if (download) {
          console.log('Inside download true');
          res.set('Content-Type', 'text/html');
          res.download(filePath);
          // return null;
        } else {
          console.log('Inside download false');
          const fileContent = (
            await FileModifiers.readFile(filePath)
          ).toString();
          res.set('Content-Type', 'application/json');
          res.send({
            data: fileContent,
          });
          // return {
          //   data: fileContent.toString(),
          // };
        }
      } else if (simInfo.currentStatus === DispatchSimulationStatus.FAILED) {
        filePath = path.join(logPath, 'job.error');
        console.log('Filepath: ', filePath);
        if (download) {
          res.set('Content-Type', 'text/html');
          res.download(filePath);
          // return null;
        } else {
          const fileContent = (
            await FileModifiers.readFile(filePath)
          ).toString();
          res.set('Content-Type', 'application/json');
          res.send({
            data: fileContent,
          });
          // return {
          //   data: fileContent.toString(),
          // };
        }
      } else if (simInfo.currentStatus === DispatchSimulationStatus.QUEUED){
        res.send({message: 'Can\'t fetch logs if the simulation is QUEUED'})
      } else {
        filePath = path.join(logPath, 'job.output');
        console.log('Filepath: ', filePath);
        console.log('Download: ', download);
        if (download) {
          console.log('Inside download true');
          res.set('Content-Type', 'text/html');
          res.download(filePath);
          // return null;
        } else {
          console.log('Inside download false');
          const fileContent = (
            await FileModifiers.readFile(filePath)
          ).toString();
          res.set('Content-Type', 'application/json');
          res.send({
            data: fileContent,
          });
        }
      }
    }
    // return null;
  }

  @Get('result/structure/:uuid')
  @ApiOperation({ summary: 'Shows result structure' })
  @ApiResponse({
    status: 200,
    description: 'Get results structure (SEDMLS and TASKS)',
    type: Object,
  })
  async getResultStructure(@Param('uuid') uId: string): Promise<{}> {
    const fileStorage = process.env.FILE_STORAGE || '';
    const structure: any = {};

    const resultPath = path.join(fileStorage, 'simulations', uId, 'out');

    const sedmls = await FileModifiers.readDir(resultPath);
    // Removing log file names 'job.output'
    sedmls.splice(sedmls.indexOf('job.output'), 1);
    sedmls.splice(sedmls.indexOf('job.error'), 1);

    for (const sedml of sedmls) {
      structure[sedml] = [];
      const taskFiles = await FileModifiers.readDir(
        path.join(resultPath, sedml)
      );
      taskFiles.forEach((taskFile: string) => {
        if (taskFile.endsWith('.csv')) {
          structure[sedml].push(taskFile.split('.csv')[0]);
        }
      });
    }

    return {
      message: 'OK',
      data: structure,
    };
  }

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
  ): Promise<{}> {
    const fileStorage = process.env.FILE_STORAGE || '';

    const jsonPath = path.join(
      fileStorage,
      'simulations',
      uId,
      'out',
      sedml,
      task
    );

    //TODO: Nestjs is internally converting boolean query param to string, remove this workaround after fixed
    chart = String(chart) === 'false'? false: true;
    const filePath = chart ? `${jsonPath}_chart.json` : `${jsonPath}.json`;
    const fileContentBuffer = await FileModifiers.readFile(filePath);
    const fileContent = JSON.parse(fileContentBuffer.toString());

    return {
      message: 'Data fetched successfully',
      data: fileContent,
    };
  }

  @Post('/jobinfo')
  @ApiOperation({ summary: 'Fetches job information from Database' })
  @ApiResponse({
    status: 200,
    description: 'Fetch all simulation information',
    type: Object,
  })
  async getJobInfo(@Body() listUid: string[]): Promise<{}> {
    return {
      message: 'Data fetched successfully',
      data: await this.modelsService.getData(listUid),
    };
  }

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
    if (simulatorName === undefined) {
      // Getting info of all available simulators
      const simulatorsInfo: any = await this.httpService
        .get(`${urls.fetchSimulatorsInfo}`)
        .toPromise();
      const allSimulators: any = [];

      for (const simulatorInfo of simulatorsInfo['data']['results']) {
        allSimulators.push(simulatorInfo['name']);
      }
      return allSimulators;
    }

    const simVersionRes = this.httpService.get(
      `https://registry.hub.docker.com/v1/repositories/biosimulators/${simulatorName.toLowerCase()}/tags`
    );

    const dockerData: any = await simVersionRes.toPromise();
    const simVersions: Array<string> = [];
    dockerData.data.forEach((element: { layer: string; name: string }) => {
      simVersions.push(element.name);
    });

    return simVersions;
  }

  async onApplicationBootstrap() {
    await this.messageClient.connect();
  }
}
