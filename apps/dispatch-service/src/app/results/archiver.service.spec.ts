import { Test, TestingModule } from '@nestjs/testing';
import { ArchiverService } from './archiver.service';
import { ConfigService } from '@nestjs/config';

import { HttpService } from '@nestjs/axios';
import { SimulationRunService } from '@biosimulations/api-nest-client';
import { SshService } from '../services/ssh/ssh.service';
import { SimulationStorageService } from '@biosimulations/shared/storage';
import { beforeEach, it, describe, expect } from '@jest/globals';

class MockSimulationService {
  updateSimulationRunResultsSize(id: string, size: number) {}
}

class MockSSHService {
  updateSimulationRunResultsSize(id: string, size: number) {}
}
describe('ArchiverService', () => {
  let service: ArchiverService;

  beforeEach(async () => {
    const mockHttp = {};
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArchiverService,

        {
          provide: SshService,
          useClass: MockSSHService,
        },
        {
          provide: SimulationStorageService,
          useValue: {},
        },

        {
          provide: SimulationRunService,
          useClass: MockSimulationService,
        },
      ],
    }).compile();
    service = module.get<ArchiverService>(ArchiverService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
