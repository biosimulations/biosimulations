import { SimulationRunService } from '@biosimulations/dispatch/nest-client';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ArchiverService } from '../services/archiver/archiver.service';

import { ResultsService } from './results.service';
class MockSimulationsRunService {
  async sendReport() {}
}
class mockArchiverService {
  async createResultArchive() {}
}

class MockClient {
  emit() {}
}
describe('ResultsService', () => {
  let service: ResultsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResultsService,
        ConfigService,
        { provide: 'NATS_CLIENT', useClass: MockClient },
        { provide: SimulationRunService, useClass: MockSimulationsRunService },
        { provide: ArchiverService, useClass: mockArchiverService },
      ],
    }).compile();

    service = module.get<ResultsService>(ResultsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
