/**
 * @file Provides the controller for HTTP API for the results of simulation runs.
 *  Get/Download operations are intended for end users.
 *  Post/Modification methods are intended for other services/admin/service users.
 * @author Bilal Shaikh
 * @copyright Biosimulations Team, 2020
 * @license MIT
 */

import { Controller, Get, Param, ParseBoolPipe, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { SimulationHDFService } from '@biosimulations/hsds/client';
import { HSDSResultsService } from './results.hsds.service';
import {
  SimulationRunOutput,
  SimulationRunResults,
} from '@biosimulations/dispatch/api-models';

@Controller('v2/results')
@ApiTags('HSDS Results')
export class NewResultsController {
  public constructor(
    private service: HSDSResultsService,
    private dataSetService: SimulationHDFService,
  ) {}

  @Get(':id')
  @ApiQuery({ name: 'includeData', type: Boolean })
  public async getResults(
    @Param('id') id: string,
    @Query('includeData', ParseBoolPipe) includeData = false,
  ): Promise<SimulationRunResults> {
    const results = await this.service.getResults(id, includeData);

    const returnValue: SimulationRunResults = {
      simId: results.simId,
      created: results.created,
      updated: results.updated,
      outputs: results.outputs,
    };

    return returnValue;
  }
}
