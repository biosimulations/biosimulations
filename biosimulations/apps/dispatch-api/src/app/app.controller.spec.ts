import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientProxyFactory, NatsOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
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
        }
      ],
    }).compile();
  });

  describe('uploadFile', () => {
    it('should return "No Simulator was provided"', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.uploadFile({
        // tslint:disable-next-line: deprecation
        buffer: new Buffer(''),
        originalname: ''
      }, {
        filepathOnDataStore: '',
        simulator: '',
        simulatorVersion: '',
        filename: '',
        uniqueFilename: ''
        
      })).toEqual({
        message: 'No Simulator was provided'
      });
    });
  });
});
