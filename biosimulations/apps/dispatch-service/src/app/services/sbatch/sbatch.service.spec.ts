import { Test, TestingModule } from '@nestjs/testing';
import { SbatchService } from './sbatch.service';

describe('SbatchService', () => {
  let service: SbatchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SbatchService],
    }).compile();

    service = module.get<SbatchService>(SbatchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
