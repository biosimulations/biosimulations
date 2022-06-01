import { Test } from '@nestjs/testing';
import { StatisticsApiService } from './statistics-api.service';

describe('StatisticsApiService', () => {
  let service: StatisticsApiService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [StatisticsApiService],
    }).compile();

    service = module.get(StatisticsApiService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
