import { Test, TestingModule } from '@nestjs/testing';
import { SimulationsService } from './simulations.service';

describe('SimulationsService', () => {
  let service: SimulationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SimulationsService],
    }).compile();

    service = module.get<SimulationsService>(SimulationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
