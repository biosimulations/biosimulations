import { Module } from '@nestjs/common';
import { StatisticsApiController } from './statistics-api.controller';
import { StatisticsApiService } from './statistics-api.service';

@Module({
  controllers: [StatisticsApiController],
  providers: [StatisticsApiService],
  exports: [StatisticsApiService],
})
export class StatisticsApiModule {}
