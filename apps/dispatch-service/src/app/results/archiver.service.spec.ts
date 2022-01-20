import { Test, TestingModule } from '@nestjs/testing';
import { ArchiverService } from './archiver.service';
import { ConfigService } from '@nestjs/config';

import { HttpService } from '@nestjs/axios';
import { SimulationRunService } from '@biosimulations/api-nest-client';
import { SimulationStorageService } from '@biosimulations/shared/storage';
import { FilePaths } from '@biosimulations/shared/storage';

class MockSimulationService {
  updateSimulationRunResultsSize(id: string, size: number) {}
}

describe('ArchiverService', () => {
  let service: ArchiverService;

  class mockStorage {
    putObject() {}
    getObject() {}
    deleteObject() {}
  }

  beforeEach(async () => {
    const mockHttp = {};
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArchiverService,
        {
          provide: SimulationRunService,
          useClass: MockSimulationService,
        },
        { provide: SimulationStorageService, useClass: mockStorage },
        { provide: FilePaths, useValue: {} },
      ],
    }).compile();
    service = module.get<ArchiverService>(ArchiverService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
