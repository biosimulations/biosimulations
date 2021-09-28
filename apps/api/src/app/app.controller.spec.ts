import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

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
