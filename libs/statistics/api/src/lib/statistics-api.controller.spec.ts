import { Test } from '@nestjs/testing';
import { StatisticsApiController } from './statistics-api.controller';
import { StatisticsApiService } from './statistics-api.service';

describe('StatisticsApiController', () => {
  let controller: StatisticsApiController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [StatisticsApiService],
      controllers: [StatisticsApiController],
    }).compile();

    controller = module.get(StatisticsApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
