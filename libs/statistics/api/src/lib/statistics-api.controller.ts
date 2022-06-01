import { Controller, Get } from '@nestjs/common';
import { StatisticsApiService } from './statistics-api.service';

@Controller('')
export class StatisticsApiController {
  constructor(private statisticsApiService: StatisticsApiService) {}

  @Get('/')
  public getStatistics() {
    return this.statisticsApiService.getStatistics();
  }
}
