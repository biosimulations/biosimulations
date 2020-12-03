import { urls } from '@biosimulations/config/common';
import { SimulationStatus } from '@biosimulations/datamodel/common';
import {
  DispatchSimulationModel,  
  OmexDispatchFile,
  SimulationDispatchSpec,
} from '@biosimulations/dispatch/api-models';
import { HttpService, Inject, Injectable, Logger } from '@nestjs/common';
import path from 'path';
import { ModelsService } from './resources/models/models.service';
import { v4 as uuid } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { MQDispatch } from '@biosimulations/messages/messages';
import { FileModifiers } from '@biosimulations/dispatch/file-modifiers';

@Injectable()
export class AppService {
  constructor(
    @Inject('DISPATCH_MQ') private messageClient: ClientProxy,
    private httpService: HttpService,
    private modelsService: ModelsService,
    private configService: ConfigService
  ) {}

  private fileStorage = this.configService.get<string>('hpc.fileStorage', '');
  private logger = new Logger(AppService.name);

  private async getJobCancel(uuid: string) {
    this.messageClient.send(MQDispatch.SIM_HPC_CANCEL, uuid);
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
    let filePathOut = '';
    let filePathErr = '';
    download = String(download) === 'false' ? false : true;
    if (simInfo === null) {
      res.send({ message: 'Cannot find the UUID specified' });
      return;
    }
    switch (download) {
      case true: {
        switch (simInfo.status) {
          case SimulationStatus.SUCCEEDED: {
            filePathOut = path.join(logPath, 'job.output');
            res.set('Content-Type', 'text/html');
            res.download(filePathOut);
            break;
          }
          // TODO: are the other error states (CANCELLED) correctly handled?
          case SimulationStatus.CANCELLED:
          case SimulationStatus.FAILED: {
            filePathErr = path.join(logPath, 'job.error');
            res.set('Content-Type', 'text/html');
            res.download(filePathErr);
            break;
          }
          case SimulationStatus.CREATED:
          case SimulationStatus.QUEUED:
          case SimulationStatus.RUNNING: {
            res.send({
              message: "Can't fetch logs because the simulation has not yet completed",
            });
            break;
          }
        }
        break;
      }
      case false: {
        switch (simInfo.status) {
          // TODO: are the other error states (CANCELLED) correctly handled?
          case SimulationStatus.SUCCEEDED:
          case SimulationStatus.CANCELLED:
          case SimulationStatus.FAILED: {
            filePathOut = path.join(logPath, 'job.output');
            filePathErr = path.join(logPath, 'job.error');
            const fileContentOut = (
              await FileModifiers.readFile(filePathOut)
            ).toString();
            const fileContentErr = (
              await FileModifiers.readFile(filePathErr)
            ).toString();
            res.set('Content-Type', 'application/json');
            res.send({
              message: 'Logs fetched successfully',
              data: {
                output: fileContentOut,
                error: fileContentErr,
              },
            });
            break;
          }
          case SimulationStatus.CREATED:
          case SimulationStatus.QUEUED:
          case SimulationStatus.RUNNING: {
            res.send({
              message: "Can't fetch logs because the simulation has not yet completed",
            });
            break;
          }
        }
      }
    }
  }

  downloadResultArchive(uId: string, res: any) {
    const zipPath = path.join(
      this.fileStorage,
      'simulations',
      uId,
      `${uId}.zip`
    );
    res.download(zipPath);
  }

  downloadUserOmexArchive(uuid: string, res: any) {
    const omexPath = path.join(this.fileStorage, 'OMEX', 'ID', `${uuid}.omex`);
    res.download(omexPath);
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
