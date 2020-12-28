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

import { getModelToken } from 'nestjs-typegoose';
import { SimulationRunModel } from '../simulation-run/simulation-run.model';
import { SharedNatsClientModule } from '@biosimulations/shared/nats-client'
describe('AppService', () => {
  let app: TestingModule;
  const mockService = {};
  class mockFile {
    data: any;
    save: () => any;
    constructor(body: any) {
      this.data = body;
      this.save = () => {
        return this.data;
      };
    }
  }
  const mockFileStoragePath = new ConfigService({
    hpc: {
      fileStorage: './apps/dispatch-api/src/assets/fixtures/',
    },
  }) as ConfigService;
  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [HttpModule, SharedNatsClientModule],
      controllers: [AppController],
      providers: [
        AppService,


        {
          provide: ConfigService,
          useValue: mockFileStoragePath,
        },
        {
          provide: getModelToken(SimulationRunModel.name),
          useClass: mockFile,
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
