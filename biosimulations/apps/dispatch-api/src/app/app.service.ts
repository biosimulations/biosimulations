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
    report: string,
    chart: boolean
  ) {
    const jsonPath = path.join(
      this.fileStorage,
      'simulations',
      uId,
      'out',
      sedml,
      report
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
      const reportFiles = await FileModifiers.readDir(
        path.join(resultPath, sedml)
      );
      reportFiles.forEach((reportFile: string) => {
        if (reportFile.endsWith('.csv')) {
          structure[sedml].push(reportFile.split('.csv')[0]);
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
          case DispatchSimulationStatus.SUCCEEDED: {
            filePathOut = path.join(logPath, 'job.output');
            res.set('Content-Type', 'text/html');
            res.download(filePathOut);
            break;
          }
          // TODO: do other failed states need to be handled (CANCELLED, TIMEOUT, OUT_OF_MEMORY, NODE_FAIL)?
          case DispatchSimulationStatus.FAILED: {
            filePathErr = path.join(logPath, 'job.error');
            res.set('Content-Type', 'text/html');
            res.download(filePathErr);
            break;
          }
          // TODO: do other starting states need to be handled (RUNNING)?
          case DispatchSimulationStatus.QUEUED: {
            res.send({
              message: `The logs cannot be fetched because the simulation has not yet completed. The simulation is in the ${simInfo.status} state.`,
            });
            break;
          }
        }
        break;
      }
      case false: {
        switch (simInfo.status) {
          // TODO: do other terminated states need to be handled (CANCELLED, TIMEOUT, OUT_OF_MEMORY, NODE_FAIL)?
          case DispatchSimulationStatus.SUCCEEDED:
          case DispatchSimulationStatus.FAILED: {
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
          // TODO: do other starting states need to be handled (RUNNING)?
          case DispatchSimulationStatus.QUEUED: {
            res.send({
              message: `The logs cannot be fetched because the simulation has not yet completed. The simulation is in the ${simInfo.status} state.`,
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


}
