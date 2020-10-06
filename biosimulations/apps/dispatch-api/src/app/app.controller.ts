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
  ApiProperty,
  ApiTags,
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
import { Cron } from '@nestjs/schedule';
import * as rmrf from 'rimraf';

@Controller()
export class AppController implements OnApplicationBootstrap {
  private logger = new Logger(AppController.name);
  constructor(
    @Inject('DISPATCH_MQ') private messageClient: ClientProxy,
    private httpService: HttpService,
    private modelsService: ModelsService
  ) {}
  @ApiTags('Dispatch')
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
  @ApiTags('Dispatch')
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
  @ApiTags('Dispatch')
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

    download = String(download) === 'false' ? false : true;

    if (simInfo === null) {
      res.send({ message: 'Cannot find the UUID specified' });
      // return {
      //   message: 'Cannot find the UUID specified',
      // };
    } else {
      let filePath: string = '';
      if (simInfo.currentStatus === DispatchSimulationStatus.SUCCEEDED) {
        filePath = path.join(logPath, 'job.output');
        // console.log('Filepath: ', filePath);
        // console.log('Download: ', download);
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
        // console.log('Filepath: ', filePath);
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
      } else if (simInfo.currentStatus === DispatchSimulationStatus.QUEUED) {
        res.send({ message: "Can't fetch logs if the simulation is QUEUED" });
      } else {
        filePath = path.join(logPath, 'job.output');
        // console.log('Filepath: ', filePath);
        // console.log('Download: ', download);
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
  @ApiTags('Dispatch')
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
    // const resultPath = '/Users/akhilteja/results/out';

    const allFilesInfo = await FileModifiers.getFilesRecursive(resultPath);
    // console.log('AllFiles: ', allFilesInfo);

    const allFiles = [];

    const indexesToSplice = [];

    for (let index = 0; index < allFilesInfo.length; index++) {
      if (
        allFilesInfo[index].name === 'job.output' ||
        allFilesInfo[index].name === 'job.error'
      ) {
        indexesToSplice.push(index);
      } else if (allFilesInfo[index].name.endsWith('.csv')) {
        // Getting only relative path
        allFiles.push(
          allFilesInfo[index].path.substring(resultPath.length + 1)
        );
      }
    }

    // Seperating files from directory paths to create structure
    for (const filePath of allFiles) {
      const filePathSplit = filePath.split('/');
      const task = filePathSplit[filePathSplit.length - 1].split('.csv')[0];

      filePathSplit.splice(filePathSplit.length - 1, 1);

      const sedml = filePathSplit.join('/');

      if (structure[sedml] === undefined) {
        structure[sedml] = [task];
      } else {
        structure[sedml].push(task);
      }
    }

    return {
      message: 'OK',
      data: structure,
    };
  }

  @ApiTags('Dispatch')
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

    chart = String(chart) === 'false' ? false : true;
    const filePath = chart ? `${jsonPath}_chart.json` : `${jsonPath}.json`;
    const fileContentBuffer = await FileModifiers.readFile(filePath);
    const fileContent = JSON.parse(fileContentBuffer.toString());

    return {
      message: 'Data fetched successfully',
      data: fileContent,
    };
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
    // Getting info of all available simulators
    const simulatorsInfo: any = await this.httpService
      .get(`${urls.fetchSimulatorsInfo}`)
      .toPromise();

    const allSimulators: any = [];

    for (const simulatorInfo of simulatorsInfo['data']['results']) {
      allSimulators.push(simulatorInfo['name']);
    }

    if (simulatorName === undefined) {
      return allSimulators;
    } else if (!allSimulators.includes(simulatorName)) {
      return [
        `Simulator ${simulatorName.toUpperCase()} is not supported, check for supported simulators on https://biosimulators.org/simulators.`,
      ];
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
