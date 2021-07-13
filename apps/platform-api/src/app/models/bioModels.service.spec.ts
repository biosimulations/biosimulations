import { Test, TestingModule } from '@nestjs/testing';
import { BioModelsService } from './bioModels.service';

describe('ModelsService', () => {
  let service: BioModelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BioModelsService],
    }).compile();

    service = module.get<BioModelsService>(BioModelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
