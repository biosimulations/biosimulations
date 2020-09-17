import { Test, TestingModule } from '@nestjs/testing';
import { ArchiverService } from './archiver.service';

describe('ArchiverService', () => {
  let service: ArchiverService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArchiverService],
    }).compile();
    service = module.get<ArchiverService>(ArchiverService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
