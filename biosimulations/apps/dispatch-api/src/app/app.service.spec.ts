import { FileModifiers } from '@biosimulations/dispatch/file-modifiers';
import { HttpModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientProxyFactory,
  NatsOptions,
  Transport,
} from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ModelsService } from './resources/models/models.service';

describe('AppService', () => {
  let app: TestingModule;
  const mockService = {};
  const mockFileStoragePath = new ConfigService({
    hpc: {
      fileStorage: './apps/dispatch-api/src/assets/fixtures/',
    },
  }) as ConfigService;
  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [AppController],
      providers: [
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
        {
          provide: ConfigService,
          useValue: mockFileStoragePath,
        },
      ],
    }).compile();
  });
  describe('test', () => {
    it('test', () => {
      expect(true).toEqual(true);
    });
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
});
