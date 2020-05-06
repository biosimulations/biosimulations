import { Test, TestingModule } from '@nestjs/testing';
import { HpcService } from './hpc.service';

describe('HpcService', () => {
  let service: HpcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HpcService],
    }).compile();

    service = module.get<HpcService>(HpcService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
