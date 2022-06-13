import { Test } from '@nestjs/testing';
import { StatisticsApiService } from './statistics-api.service';

import { getModelToken } from '@nestjs/mongoose';
import { StatsItem } from './statistics-api.database.model';
describe('StatisticsApiService', () => {
  let service: StatisticsApiService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [StatisticsApiService, { provide: getModelToken(StatsItem.name), useValue: {} }],
    }).compile();

    service = module.get(StatisticsApiService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
