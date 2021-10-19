/**
 * @file Test file for the results controller
 * @author Bilal Shaikh
 * @copyright Biosimulations Team, 2020
 * @license MIT
 */
import { BiosimulationsAuthModule } from '@biosimulations/auth/nest';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import {
  HSDSClientModule,
  SimulationHDFService,
} from '@biosimulations/hsds/client';
import { SharedStorageService } from '@biosimulations/shared/storage';
import { CacheModule } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ResultsController } from './results.controller';
import { ResultsModel } from './results.model';
import { ResultsService } from './results.service';

describe('ResultsController', () => {
  let controller: ResultsController;
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
  class MockStorageService {
    getObject(id: string) {
      return;
    }
    putObject(id: string, data: Buffer) {}
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResultsController],
      imports: [
        BiosimulationsAuthModule,
        BiosimulationsConfigModule,
        CacheModule.register(),
      ],
      providers: [
        ResultsService,
        {
          provide: SimulationHDFService,
          useClass: MockStorageService,
        },
        {
          provide: getModelToken(ResultsModel.name),
          useClass: mockFile,
        },
        {
          provide: SharedStorageService,
          useClass: MockStorageService,
        },
      ],
    }).compile();

    controller = module.get<ResultsController>(ResultsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
