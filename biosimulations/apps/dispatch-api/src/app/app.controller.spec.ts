import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import {
  ClientProxyFactory,
  NatsOptions,
  Transport,
} from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { HttpModule, Controller } from '@nestjs/common';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [AppController],
      providers: [
        ConfigService,
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
      ],
    }).compile();
  });

  describe('test uploadFile', () => {
    it('should return "No Simulator was provided" when no simulator is provided', async () => {
      const appController = app.get<AppController>(AppController);
      expect(
        await appController.uploadFile(
          {
            // tslint:disable-next-line: deprecation
            buffer: Buffer.alloc(1, ''),
            originalname: '',
          },
          {
            filepathOnDataStore: '',
            simulator: '',
            simulatorVersion: '',
            filename: '',
            uniqueFilename: '',
          }
        )
      ).toEqual({
        message: 'No Simulator was provided',
      });
    });
  });

  
  describe('getVisualizationData', () => {
    it('should run with given parameters and save generate JSON data', () => {
      const appController = app.get<AppController>(AppController)
      expect(appController.getVisualizationData('21312312asad', false, 'VilarBMDB', 'task1'))
      .toBeDefined();
    })
  })


});
