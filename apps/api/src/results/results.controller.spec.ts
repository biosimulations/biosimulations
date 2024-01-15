/**
 * @file Test file for the results controller
 * @author Bilal Shaikh
 * @copyright BioSimulations Team, 2020
 * @license MIT
 */
import { BiosimulationsAuthModule } from '@biosimulations/auth/nest';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import { SimulationHDFService } from '@biosimulations/simdata-api/nest-client-wrapper';
import { SimulationStorageService } from '@biosimulations/shared/storage';
import { CacheModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ResultsController } from './results.controller';
import { ResultsService } from './results.service';
import { beforeEach, it, describe, expect } from '@jest/globals';

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
      imports: [BiosimulationsAuthModule, BiosimulationsConfigModule],
      providers: [
        ResultsService,
        {
          provide: SimulationHDFService,
          useClass: MockStorageService,
        },
        {
          provide: SimulationStorageService,
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
