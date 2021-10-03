import { Test, TestingModule } from '@nestjs/testing';
import { SedmlService } from './sedml.service';

describe('SedmlService', () => {
  let service: SedmlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SedmlService],
    }).compile();

    service = module.get<SedmlService>(SedmlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
