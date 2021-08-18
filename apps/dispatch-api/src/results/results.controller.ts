/**
 * @file Provides the controller for HTTP API for the results of simulation runs.
 *  Get/Download operations are intended for end users.
 *  Post/Modification methods are intended for other services/admin/service users.
 * @author Bilal Shaikh
 * @copyright Biosimulations Team, 2020
 * @license MIT
 */

import {
  Controller,
  Get,
  Param,
  ParseBoolPipe,
  Query,
  Res,
} from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SimulationHDFService } from '@biosimulations/hsds/client';
import { ResultsService } from './results.service';
import {
  SimulationRunOutput,
  SimulationRunResults,
} from '@biosimulations/dispatch/api-models';
import { Response } from 'express';
@Controller('results')
@ApiTags('Results')
export class ResultsController {
  public constructor(
    private service: ResultsService,
    private dataSetService: SimulationHDFService,
  ) {}

  @Get(':simId')
  @ApiQuery({ name: 'includeData', type: Boolean })
  @ApiResponse({ status: 200, description: 'ok', type: SimulationRunResults })
  public async getResults(
    @Param('simId') id: string,
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

  @Get(':simId/download')
    @ApiTags('Downloads')
  public async downloadResultReport(
    @Param('simId') simId: string,
    @Res() res: Response,
  ): Promise<void> {
    const file = await this.service.download(simId);
    res.contentType('application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="outputs.zip"');
    res.write(file);
    res.send();
  }

  @Get(':simId/:outputId')
  @ApiResponse({ status: 200, type: SimulationRunOutput, description: 'ok' })
  @ApiQuery({ name: 'includeData', type: Boolean })
  public async getResultReport(
    @Param('simId') simId: string,
    @Param('outputId') outputId: string,
    @Query('includeData', ParseBoolPipe) includeData = false,
  ): Promise<SimulationRunOutput> {
    const resultModel = await this.service.getOutput(
      simId,
      outputId,
      includeData,
    );

    return resultModel;
  }
}
