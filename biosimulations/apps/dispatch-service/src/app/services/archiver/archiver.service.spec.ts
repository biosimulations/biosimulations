import { Test, TestingModule } from '@nestjs/testing';
import { ArchiverService } from './archiver.service';
import { ConfigService } from '@nestjs/config';

import { HttpService } from '@nestjs/common';
import { SimulationRunService } from '@biosimulations/dispatch/nest-client';

class MockSimulationService {
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
          provide: HttpService,
          useValue: mockHttp,
        },
        ConfigService,
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
