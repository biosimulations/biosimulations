import { urls } from '@biosimulations/config/common';
import {
  DispatchSimulationModel,
  DispatchSimulationStatus,
  OmexDispatchFile,
  SimulationDispatchSpec,
} from '@biosimulations/dispatch/api-models';
import { HttpService, Inject, Injectable, Logger } from '@nestjs/common';
import path from 'path';
import { ModelsService } from './resources/models/models.service';
import { v4 as uuid } from 'uuid';
import { ClientProxy } from '@nestjs/microservices';
import { MQDispatch } from '@biosimulations/messages';
import { FileModifiers } from '@biosimulations/dispatch/file-modifiers';

@Injectable()
export class AppService {
  constructor(
    @Inject('DISPATCH_MQ') private messageClient: ClientProxy,
    private httpService: HttpService,
    private modelsService: ModelsService
  ) {}

  private readonly fileStorage = process.env.FILE_STORAGE || '';
  private logger = new Logger('AppService');
  async uploadFile(file: OmexDispatchFile, bodyData: SimulationDispatchSpec) {
    // TODO: Create the required folders automatically
    const omexStorage = `${this.fileStorage}/OMEX/ID`;

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
          projectSize: Buffer.byteLength(file.buffer),
          resultSize: 0
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
        fileName: uniqueFilename,
        simulationName: simSpec.nameOfSimulation,
        simulator: simSpec.simulator.toUpperCase(),
        simulatorVersion: simSpec.simulatorVersion,
      },
    };
  }

  async getVisualizationData(
    uId: string,
    sedml: string,
    task: string,
    chart: boolean
  ) {
    const jsonPath = path.join(
      this.fileStorage,
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

  async getResultStructure(uId: string) {
    const structure: any = {};

    const resultPath = path.join(this.fileStorage, 'simulations', uId, 'out');

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

  async downloadLogFile(uId: string, download: boolean, res: any) {
    const logPath = path.join(this.fileStorage, 'simulations', uId, 'out');
    const simInfo = await this.modelsService.get(uId);

    download = String(download) === 'false' ? false : true;

    if (simInfo === null) {
      res.send({ message: 'Cannot find the UUID specified' });
    } else {
      let filePath: string = '';
      if (simInfo.currentStatus === DispatchSimulationStatus.SUCCEEDED) {
        filePath = path.join(logPath, 'job.output');

        if (download) {
          res.set('Content-Type', 'text/html');
          res.download(filePath);
        } else {
          const fileContent = (
            await FileModifiers.readFile(filePath)
          ).toString();
          res.set('Content-Type', 'application/json');
          res.send({
            data: fileContent,
          });
        }
      } else if (simInfo.currentStatus === DispatchSimulationStatus.FAILED) {
        filePath = path.join(logPath, 'job.error');
        console.log('Filepath: ', filePath);
        if (download) {
          res.set('Content-Type', 'text/html');
          res.download(filePath);
        } else {
          const fileContent = (
            await FileModifiers.readFile(filePath)
          ).toString();
          res.set('Content-Type', 'application/json');
          res.send({
            data: fileContent,
          });
        }
      } else if (simInfo.currentStatus === DispatchSimulationStatus.QUEUED) {
        res.send({ message: "Can't fetch logs if the simulation is QUEUED" });
      } else {
        filePath = path.join(logPath, 'job.output');
        console.log('Filepath: ', filePath);
        console.log('Download: ', download);
        if (download) {
          console.log('Inside download true');
          res.set('Content-Type', 'text/html');
          res.download(filePath);
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
  }

  downloadArchive(uId: string, res: any) {
    const zipPath = path.join(
      this.fileStorage,
      'simulations',
      uId,
      `${uId}.zip`
    );
    res.download(zipPath);
  }

  async getSimulators(simulatorName: string) {
    // Getting info of all available simulators from dockerhub
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
}
