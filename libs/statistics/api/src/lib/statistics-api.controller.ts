import { StatItem, StatsChartType } from '@biosimulations/statistics-datamodel';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StatisticsApiService } from './statistics-api.service';

@Controller('')
@ApiTags('Statistics')
export class StatisticsApiController {
  public constructor(private statisticsApiService: StatisticsApiService) {}

  @Get('/')
  public getStatistics() {
    return this.statisticsApiService.getStatistics();
  }

  @Get('models')
  public getModels(): StatItem[] {
    return [this.getTaxonomy(), this.getSystems(), this.getModelsFormats()];
  }
  @Get('models/taxa')
  public getTaxonomy() {
    return this.statisticsApiService.getTaxonomy();
  }

  @Get('models/systems')
  public getSystems() {
    return this.statisticsApiService.getSystems();
  }

  @Get('models/formats')
  public getModelsFormats() {
    return this.statisticsApiService.getModelsFormats();
  }

  @Get('projects/sizes')
  public getModelsSizes() {
    return this.statisticsApiService.getModelsSizes();
  }

  @Get('projects/contributors')
  public getContributors() {
    return this.statisticsApiService.getContributors();
  }

  @Get('projects/repositories')
  public getRepositories() {
    return this.statisticsApiService.getRepositories();
  }

  @Get('projects/licenses')
  public getLicenses() {
    return this.statisticsApiService.getLicenses();
  }

  @Get('simulations/frameworks')
  public getFrameworks() {
    return this.statisticsApiService.getFrameworks();
  }

  @Get('simulations/algorithms')
  public getAlgorithms() {
    return this.statisticsApiService.getAlgorithms();
  }

  @Get('simulations/tools')
  public getTools(): StatItem {
    return this.statisticsApiService.getTools();
  }
}
