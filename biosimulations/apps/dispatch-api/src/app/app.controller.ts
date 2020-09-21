import {
  Controller,
  Inject,
  OnApplicationBootstrap,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  HttpException,
  HttpStatus,
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
} from '@nestjs/swagger';

import { v4 as uuid } from 'uuid';
import * as fs from 'fs';
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
          type: 'string',
        },
        nameOfSimulation: {
          type: 'string',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: OmexDispatchFile,
    @Body() bodyData: SimulationDispatchSpec
  ) {
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
      simulator: bodyData.simulator,
      simulatorVersion: bodyData.simulatorVersion,
      filename: file.originalname,
      uniqueFilename,
      filepathOnDataStore: omexSavePath,
    };

    // Save the file
    await this.writeFile(omexSavePath, file.buffer);

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
  @ApiResponse({
    status: 200,
    description: 'Download all results as zip archive',
    type: Object,
  })
  archive(@Param('uuid') uId: string, @Res() res: any) {
    const fileStorage = process.env.FILE_STORAGE || '';
    const zipPath = path.join(fileStorage, 'simulations', uId, `${uId}.zip`);
    res.download(zipPath);
  }

  @Get('result/structure/:uuid')
  @ApiResponse({
    status: 200,
    description: 'Get results structure (SEDMLS and TASKS)',
    type: Object,
  })
  async getResultStructure(@Param('uuid') uId: string) {
    const fileStorage = process.env.FILE_STORAGE || '';
    const structure: any = {};

    const resultPath = path.join(fileStorage, 'simulations', uId, 'out');

    const sedmls = await this.readDir(resultPath);
    // Removing log file names 'job.output'
    sedmls.splice(sedmls.indexOf('job.output'), 1);

    for (const sedml of sedmls) {
      structure[sedml] = [];
      const taskFiles = await this.readDir(path.join(resultPath, sedml));
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
  ) {
    const fileStorage = process.env.FILE_STORAGE || '';

    const jsonPath = path.join(
      fileStorage,
      'simulations',
      uId,
      'out',
      sedml,
      task
    );
    const filePath = chart ? `${jsonPath}_chart.json` : `${jsonPath}.json`;
    const fileContentBuffer = await this.readFile(filePath);
    const fileContent = JSON.parse(fileContentBuffer.toString());

    return {
      message: 'Data fetched successfully',
      data: fileContent,
    };
  }

  @Get('simulators')
  @ApiResponse({
    status: 200,
    description: 'Get all simulators and their versions',
    type: Object,
  })
  @ApiQuery({ name: 'name', required: false })
  async getAllSimulatorVersion(@Query('name') simulatorName: string) {
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

  readDir(dirPath: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      fs.readdir(dirPath, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  readFile(filePath: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      fs.readFile(filePath, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  writeFile(path: string, data: Buffer): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      fs.writeFile(path, data, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async onApplicationBootstrap() {
    await this.messageClient.connect();
  }
}
