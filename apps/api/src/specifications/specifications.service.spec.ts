import { Test, TestingModule } from '@nestjs/testing';
import { SpecificationsService } from './specifications.service';

describe('SpecificationsService', () => {
  let service: SpecificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpecificationsService],
    }).compile();

    service = module.get<SpecificationsService>(SpecificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
