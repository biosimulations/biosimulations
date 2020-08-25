import { Test, TestingModule } from '@nestjs/testing';
import { SimulatorsService } from './simulators.service';

describe('SimulatorsService', () => {
  let service: SimulatorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SimulatorsService],
    }).compile();

    service = module.get<SimulatorsService>(SimulatorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
