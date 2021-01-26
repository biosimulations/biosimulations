import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import {
  ClientProxyFactory,
  NatsOptions,
  Transport,
} from '@nestjs/microservices';

import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/common';
import { AppService } from './app.service';
import { SimulationRunModel } from '../simulation-run/simulation-run.model';
import { SharedNatsClientModule } from '@biosimulations/shared/nats-client';
import { getModelToken } from '@nestjs/mongoose';
describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
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
    app = await Test.createTestingModule({
      imports: [HttpModule, SharedNatsClientModule],
      controllers: [AppController],
      providers: [
        ConfigService,
        AppService,
        {
          provide: getModelToken(SimulationRunModel.name),
          useClass: mockFile,
        },
      ],
    }).compile();
  });

  describe('Compiles', () => {
    it('Should be truthy', async () => {
      const appController = app.get<AppController>(AppController);
      expect(await appController).toBeTruthy();
    });
  });
});
