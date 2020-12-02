import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import {
  ClientProxyFactory,
  NatsOptions,
  Transport,
} from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/common';
import { ModelsService } from './resources/models/models.service';
import { AppService } from './app.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    const mockService = {};
    app = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [AppController],
      providers: [
        ConfigService,
        AppService,
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
            email: '',
            name: '',
          }
        )
      ).toEqual({
        message: 'No Simulator was provided',
      });
    });
  });

  
});
