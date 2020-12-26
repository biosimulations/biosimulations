import { SimulationRunStatus } from '@biosimulations/dispatch/api-models';
import { SimulationRunModel } from './../simulation-run/simulation-run.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  HttpService,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import path from 'path';

import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';

import { FileModifiers } from '@biosimulations/dispatch/file-modifiers';

@Injectable()
export class AppService {
  constructor(
    @Inject('DISPATCH_MQ') private messageClient: ClientProxy,

    private configService: ConfigService,
    @InjectModel(SimulationRunModel.name)
    private simulationModel: Model<SimulationRunModel>
  ) {}

  private fileStorage = this.configService.get<string>('hpc.fileStorage', '');
  private logger = new Logger(AppService.name);

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
    let filePathOut = '';
    let filePathErr = '';
    download = String(download) === 'false' ? false : true;

    const jobStatus: string = await this.jobStatusFromDb(uId);

    if (download) {
      switch (jobStatus) {
        case SimulationRunStatus.SUCCEEDED: {
          filePathOut = path.join(logPath, 'job.output');
          res.set('Content-Type', 'text/html');
          res.download(filePathOut);
          break;
        }

        case SimulationRunStatus.FAILED: {
          filePathErr = path.join(logPath, 'job.error');
          res.set('Content-Type', 'text/html');
          res.download(filePathErr);
          break;
        }
        case SimulationRunStatus.RUNNING:
        case SimulationRunStatus.QUEUED: {
          res.send({
            message: `The logs cannot be fetched because the simulation has not yet completed. The simulation is in the ${jobStatus} state.`,
          });
          break;
        }
      }
    } else {
      switch (jobStatus) {
        case SimulationRunStatus.SUCCEEDED:
        case SimulationRunStatus.FAILED: {
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

        case SimulationRunStatus.RUNNING:
        case SimulationRunStatus.QUEUED: {
          res.send({
            message: `The logs cannot be fetched because the simulation has not yet completed. The simulation is in the ${jobStatus} state.`,
          });
          break;
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

  async jobStatusFromDb(id: string): Promise<string> {
    const runModels: SimulationRunModel[] = await this.simulationModel
      .find({ _id: id }, { status: 1, _id: 0 })
      .exec();

    if (runModels.length > 0) {
      return runModels[0].status;
    } else {
      throw new NotFoundException(`No simulation with ID: ${id} found.`);
    }
  }
}
