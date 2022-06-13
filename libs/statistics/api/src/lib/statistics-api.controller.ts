import { permissions } from '@biosimulations/auth/nest';
import { Statistic } from '@biosimulations/statistics-datamodel';
import { Body, Controller, Get, Param, ParseBoolPipe, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { scopes } from '@biosimulations/auth/common';
import { StatisticsApiService } from './statistics-api.service';

@Controller('')
@ApiTags('Statistics')
export class StatisticsApiController {
  public constructor(private statisticsApiService: StatisticsApiService) {}

  @Post('/')
  @permissions(scopes.statistics.write.id)
  @ApiBody({ type: Statistic })
  public PostStatistics(@Body() body: { id: string; labels: []; values: [] }) {
    return this.statisticsApiService.PostStatistics(body);
  }

  @Put('/:id')
  @permissions(scopes.statistics.write.id)
  @ApiBody({ type: Statistic })
  public PutStatistics(@Param('id') id: string, @Body() body: Statistic) {
    return this.statisticsApiService.PutStatistics(id, body);
  }

  @Get('/')
  public getStatistics() {
    return this.statisticsApiService.getStatistics();
  }

  @Get('/:id')
  @ApiQuery({ name: 'top', required: true, description: 'The number of items to return' })
  @ApiQuery({ name: 'group', required: true, description: 'Group the remaining items into "other" ' })
  public getStatisticsById(
    @Param('id') id: string,
    @Query('top', ParseIntPipe) topCount: number | undefined,
    @Query('group', ParseBoolPipe) group: boolean,
  ): Promise<Statistic> {
    return this.statisticsApiService.getStat(id, topCount || 0, group);
  }
}
