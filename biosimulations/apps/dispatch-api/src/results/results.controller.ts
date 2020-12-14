/**
 * @file Provides the controller for HTTP API for the results of Simulation Runs. Get/Download operations are intended for end users. Post/Modification methods are intended for other services/admin/service users.
 * @author Bilal Shaikh
 * @copyright Biosimulations Team, 2020
 * @license MIT
 */
import {
  JwtGuard,
  PermissionsGuard,
  permissions,
} from '@biosimulations/auth/nest';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOAuth2, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ResultsService } from './results.service';

@Controller('results')
@ApiTags('Results')
export class ResultsController {
  constructor(private service: ResultsService) {}
  @UseGuards(JwtGuard, PermissionsGuard)
  @permissions('read:SimulationRunResults')
  @ApiOAuth2(['read:SimulationRunResults'])
  @Get()
  getResults() {
    return this.service.getResults();
  }

  @Get(':simId')
  @ApiQuery({ name: 'sparse', type: Boolean })
  getResult(
    @Param('simId') simId: string,
    @Query('sparse', ParseBoolPipe) sparse = true
  ) {
    console.log(simId);
    console.log(sparse);
    return this.service.getResult(simId, sparse);
  }

  @Get(':simId/download')
  downloadResult(@Param('simId') simId: string) {
    return this.service.download(simId);
  }

  @Get(':simId/:reportId')
  @ApiQuery({ name: 'sparse', type: Boolean })
  getResultReport(
    @Param('simId') simId: string,
    @Param('reportId') reportId: string,
    @Query('sparse', ParseBoolPipe) sparse = true
  ) {
    return this.service.getResultReport(simId, reportId, sparse);
  }

  @Get(':simId/:reportId/download')
  downloadResultReport(
    @Param('simId') simId: string,
    @Param('resportId') reportId: string
  ) {
    return this.service.downloadReport(simId, reportId);
  }

  @UseGuards(JwtGuard, PermissionsGuard)
  @permissions('delete:SimulationRunResults')
  @ApiOAuth2(['delete:SimulationRunResults'])
  @Delete()
  deleteResults() {
    return this.service.deleteAll();
  }
  @UseGuards(JwtGuard, PermissionsGuard)
  @permissions('delete:SimulationRunResults')
  @ApiOAuth2(['delete:SimulationRunResults'])
  @Delete(':simId')
  deleteResult(@Param('simId') simId: string) {
    return this.service.delete(simId);
  }

  @UseGuards(JwtGuard, PermissionsGuard)
  @permissions('delete:SimulationRunResults')
  @ApiOAuth2(['delete:SimulationRunResults'])
  @Delete(':simId/:resultId')
  deleteResultReport(
    @Param('simId') simId: string,
    @Param('reportId') reportId: string
  ) {
    return this.service.delete(simId);
  }
}
