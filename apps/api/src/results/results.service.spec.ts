/**
 * @file Test file for the results service
 * @author Bilal Shaikh
 * @copyright BioSimulations Team, 2020
 * @license MIT
 */
import { SimulationStorageService } from '@biosimulations/shared/storage';
import { SimulationHDFService } from '@biosimulations/simdata-api/nest-client-wrapper';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ResultsService } from './results.service';
import { ConfigService } from '@nestjs/config';
import { beforeEach, it, describe, expect } from '@jest/globals';

describe('ResultsService', () => {
  let service: ResultsService;
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
    deleteObject() {}
  }

  class mockSimService {
    getDataSets(id: string) {
      return;
    }
    getDataSetbyId(id: string) {}
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResultsService,
        {
          provide: SimulationStorageService,
          useClass: MockStorageService,
        },
        {
          provide: SimulationHDFService,
          useClass: mockSimService,
        },
        ConfigService,
      ],
    }).compile();

    service = module.get<ResultsService>(ResultsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
