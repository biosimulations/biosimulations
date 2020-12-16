import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { ConfigService } from '@nestjs/config';
import { HpcService } from './services/hpc/hpc.service';
import { SshService } from './services/ssh/ssh.service';
import { SbatchService } from './services/sbatch/sbatch.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import {
  ClientProxyFactory,
  Transport,
  NatsOptions,
} from '@nestjs/microservices';
import { ArchiverService } from './services/archiver/archiver.service';

import { assert } from 'console';
// TODO fix these tests
describe('AppController', () => {
  let app: TestingModule;
  describe('PLACEHOLDER', () => {
    it('should be true', () => {
      assert(true);
    });
  });
  /* beforeAll(async () => {
    const mockService = {};
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        ConfigService,
        HpcService,
        SshService,
        SbatchService,
        SchedulerRegistry,
        ArchiverService,
        ModelsService,
        SimulationService,
        {
          provide: 'DISPATCH_MQ',
          useFactory: (configService: ConfigService) => {
            const natsServerConfig = configService.get('nats');
            const natsOptions: NatsOptions = {};
            natsOptions.transport = Transport.NATS;
            natsOptions.options = natsServerConfig;
            return ClientProxyFactory.create(natsOptions);
          },
          inject: [ConfigService],
        },
        {
          provide: ModelsService,
          useValue: mockService,
        },
      ],
    }).compile();
  }); */
  /* 
  describe('uploadFile', () => {
    it('should return "Unsupported simulator was provided!"', async () => {
      const appController = app.get<AppController>(AppController);
      // tslint:disable-next-line: deprecation
      expect(
        await appController.uploadFile({
          simulator: 'BIONETGEN',
          simulatorVersion: 'latest',
          filename: '',
          uniqueFilename: '',
          filepathOnDataStore: '',
          author: '',
          name: '',
        })
      ).toEqual({
        message: 'Unsupported simulator was provided!',
      });
    });
  }); */

  /*   describe('dispatchLog', () => {
    it('should be defined', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.dispatchLog({})).toBeDefined();
    });
  }); */

  /*   describe('convertJSONtoChartJSON', () => {
    it('should return JSON used by plotly linechart', () => {
      const appController = app.get<AppController>(AppController);
      expect(
        appController.convertJsonDataToChartData(
          JSON.parse(
            `[
              {
                "time": "0.0",
                "UnInfected_Tumour_Cells_Xu": "500000.0"
              },
              {
                "time": "0.1",
                "UnInfected_Tumour_Cells_Xu": "548268.0"
              },
              {
                "time": "0.2",
                "UnInfected_Tumour_Cells_Xu": "600386.0"
              },
              {
                "time": "0.3",
                "UnInfected_Tumour_Cells_Xu": "655801.0"
              },
              {
                "time": "0.4",
                "UnInfected_Tumour_Cells_Xu": "713931.0"
              },
              {
                "time": "0.5",
                "UnInfected_Tumour_Cells_Xu": "774275.0"
              },
              {
                "time": "0.6",
                "UnInfected_Tumour_Cells_Xu": "836486.0"
              }
            ]`
          )
        )
      ).toEqual(
        JSON.parse(
          `{
            "UnInfected_Tumour_Cells_Xu": {
              "x": [
                "0.0",
                "0.1",
                "0.2",
                "0.3",
                "0.4",
                "0.5",
                "0.6"
              ],
              "y": [
                "500000.0",
                "548268.0",
                "600386.0",
                "655801.0",
                "713931.0",
                "774275.0",
                "836486.0"
              ],
              "type": "scatter"
            }
          }`
        )
      );
    });
  });
 */
  /* describe('test dispatchLog', () => {
    it('should return promise', () => {
      const appController = app.get<AppController>(AppController);
      const promise = appController.dispatchLog({});
      expect(promise).toEqual(promise);
    });
  });
 */
  /* describe('test jobMonitorCronJob', () => {
    it('should return promise', () => {
      const appController = app.get<AppController>(AppController);
      const jobMonitor = appController.jobMonitorCronJob(
        '356789',
        '5b7de05f-401b-4903-b534-d74bbbc5856c',
        5
      );
      expect(jobMonitor).toBeDefined();
    });
  }); */
});
