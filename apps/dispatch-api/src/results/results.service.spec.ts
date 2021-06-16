/**
 * @file Test file for the results service
 * @author Bilal Shaikh
 * @copyright Biosimulations Team, 2020
 * @license MIT
 */
import { SharedStorageService } from '@biosimulations/shared/storage';
import { SimulationHDFService } from '@biosimulations/hsds/client';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ResultsModel } from './results.model';
import { ResultsService } from './results.service';

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
          provide: getModelToken(ResultsModel.name),
          useClass: mockFile,
        },
        {
          provide: SharedStorageService,
          useClass: MockStorageService,
        },
      ],
    }).compile();

    service = module.get<ResultsService>(ResultsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
