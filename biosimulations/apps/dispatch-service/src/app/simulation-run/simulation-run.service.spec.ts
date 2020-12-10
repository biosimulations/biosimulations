import { Test, TestingModule } from '@nestjs/testing';
import { SimulationRunService } from './simulation-run.service';

describe('SimulationRunservice', () => {
  let service: SimulationRunService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SimulationRunService],
    }).compile();

    service = module.get<SimulationRunService>(SimulationRunService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
