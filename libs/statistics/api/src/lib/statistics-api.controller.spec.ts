import { Test } from '@nestjs/testing';
import { StatisticsApiController } from './statistics-api.controller';
import { StatisticsApiService } from './statistics-api.service';
import { getModelToken } from '@nestjs/mongoose';
import { StatsItem } from './statistics-api.database.model';
import { BiosimulationsAuthModule } from '@biosimulations/auth/nest';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
describe('StatisticsApiController', () => {
  let controller: StatisticsApiController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [BiosimulationsAuthModule, BiosimulationsConfigModule],
      providers: [StatisticsApiService, { provide: getModelToken(StatsItem.name), useValue: {} }],
      controllers: [StatisticsApiController],
    }).compile();

    controller = module.get(StatisticsApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
