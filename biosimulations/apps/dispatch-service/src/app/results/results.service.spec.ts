import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { SimulationRunService } from '../simulation-run/simulation-run.service';
import { ResultsService } from './results.service';
class MockSimulationsRunService {
  async sendReport() {}
}

describe('ResultsService', () => {
  let service: ResultsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResultsService,
        ConfigService,
        { provide: SimulationRunService, useClass: MockSimulationsRunService }
      ]
    }).compile();

    service = module.get<ResultsService>(ResultsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
