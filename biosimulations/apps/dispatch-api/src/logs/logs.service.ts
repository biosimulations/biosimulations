import { CombineArchiveLog } from '@biosimulations/dispatch/api-models';
import {
  SimulationRunLogStatus,
  SimulationRunStatus
} from '@biosimulations/datamodel/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileModifiers } from '@biosimulations/dispatch/file-modifiers';
import path from 'path';

@Injectable()
export class LogsService {
  constructor(private configService: ConfigService) {}
  private fileStorage = this.configService.get<string>('hpc.fileStorage', '');

  getLog(id: string): CombineArchiveLog {
    const structuredLog = {
      status: SimulationRunLogStatus.QUEUED,
      exception: null,
      skipReason: null,
      output: null,
      duration: null,
      sedDocuments: [
        {
          location: 'a',
          status: SimulationRunLogStatus.QUEUED,
          exception: {
            category: '',
            message: ''
          },
          skipReason: {
            category: '',
            message: ''
          },
          output: 'output',
          duration: 1.0,
          tasks: [
            {
              id: 'x',
              status: SimulationRunLogStatus.QUEUED,
              exception: {
                category: '',
                message: ''
              },
              skipReason: {
                category: '',
                message: ''
              },
              output: 'output',
              duration: 1.0,
              algorithm: 'KISAO_0000019',
              simulatorDetails: [
                {
                  key: 'method',
                  value: 'tellurium.simulate'
                },
                {
                  key: 'arguments',
                  value: {
                    rtol: '1e-6',
                    atol: '1e-8'
                  }
                }
              ]
            },
            {
              id: 'y',
              status: SimulationRunLogStatus.RUNNING,
              exception: {
                category: '',
                message: ''
              },
              skipReason: {
                category: '',
                message: ''
              },
              output: 'terminal output message \n terminal output error ',
              duration: 1.0,
              algorithm: null,
              simulatorDetails: null
            }
          ],
          outputs: [
            {
              id: 'report_1',
              status: SimulationRunLogStatus.SUCCEEDED,
              exception: null,
              skipReason: null,
              output: null,
              duration: 1.0,
              dataSets: [
                { id: 'u', status: SimulationRunLogStatus.RUNNING },
                { id: 'v', status: SimulationRunLogStatus.RUNNING },
                { id: 'w', status: SimulationRunLogStatus.RUNNING }
              ]
            },
            {
              id: 'plot_1',
              status: SimulationRunLogStatus.FAILED,
              exception: null,
              skipReason: null,
              output: null,
              duration: 1.0,
              curves: [
                { id: 'u', status: SimulationRunLogStatus.RUNNING },
                { id: 'v', status: SimulationRunLogStatus.RUNNING },
                { id: 'w', status: SimulationRunLogStatus.RUNNING }
              ]
            }
          ]
        },
        {
          location: 'b',
          status: SimulationRunLogStatus.RUNNING,
          exception: {
            category: '',
            message: ''
          },
          skipReason: {
            category: '',
            message: ''
          },
          output: 'output',
          duration: 1.0,
          tasks: [
            {
              id: 'x',
              status: SimulationRunLogStatus.SUCCEEDED,
              exception: {
                category: '',
                message: ''
              },
              skipReason: {
                category: '',
                message: ''
              },
              output: 'output',
              duration: 1.0,
              algorithm: null,
              simulatorDetails: null
            },
            {
              id: 'y',
              status: SimulationRunLogStatus.FAILED,
              exception: {
                category: '',
                message: ''
              },
              skipReason: {
                category: '',
                message: ''
              },
              output: 'output',
              duration: 1.0,
              algorithm: null,
              simulatorDetails: null
            }
          ],
          outputs: []
        }
      ]
    };
    return structuredLog;
  }

  async getOldLogs(uId: string) {
    const logPath = path.join(this.fileStorage, 'simulations', uId, 'out');
    let filePathOut = '';
    let filePathErr = '';

    filePathOut = path.join(logPath, 'job.output');
    filePathErr = path.join(logPath, 'job.error');
    const fileContentOut = (await FileModifiers.readFile(filePathOut))
      .catch((e: any) => console.log(e))
      .toString();
    const fileContentErr = (await FileModifiers.readFile(filePathErr))
      .catch((e: any) => console.log(e))
      .toString();

    return {
      output: fileContentOut,
      error: fileContentErr
    };
  }
}
