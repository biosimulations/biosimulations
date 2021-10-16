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
import {
  ApiQuery,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { SimulationHDFService } from '@biosimulations/hsds/client';
import { ResultsService } from './results.service';
import {
  SimulationRunOutput,
  SimulationRunResults,
} from '@biosimulations/datamodel/api';
import { Response } from 'express';
@Controller('results')
@ApiTags('Results')
export class ResultsController {
  public constructor(
    private service: ResultsService,
    private dataSetService: SimulationHDFService,
  ) {}

  @ApiOperation({
    summary: 'Get the results of all of the outputs of a simulation run',
    description:
      'Get the results of each report and plot of each SED-ML file for the simulation run',
  })
  @Get(':simId')
  @ApiParam({
    name: 'simId',
    description: 'Id of a simulation run',
    required: true,
    type: String,
  })
  @ApiQuery({
    name: 'includeData',
    description: 'Whether to include the simulation results or to only return the structurre of the results (e.g., ids, names of the avaialable reports and data sets).',
    type: Boolean,
    required: false,
  })
  @ApiOkResponse({ 
    description: 'The simulation results were successfully retrieved', 
    type: SimulationRunResults
  })
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

  @ApiOperation({
    summary: 'Download all of the outputs of a simulation run',
    description:
      'Download a zip file that contains each report (HDF5 format) and plot (PDF format) of each SED-ML file for the simulation run, as well as the log (YAML format) of the simulation run',
  })
  @Get(':simId/download')
  @ApiParam({
    name: 'simId',
    description: 'Id of a simulation run',
    required: true,
    type: String,
  })
  @ApiOkResponse({ 
    description: 'The simulation results were successfully downloaded', 
    type: SimulationRunResults
  })
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

  @ApiOperation({
    summary:
      'Get the results of an output (plot or report) of a simulation run',
    description:
      'Get the results of a single output (SED plot or report of a SED-ML file) of a simulation run',
  })
  @Get(':simId/:outputId')
  @ApiParam({
    name: 'simId',
    description: 'Id of a simulation run',
    required: true,
    type: String,
  })
  @ApiParam({
    name: 'outputId',
    description:
      'Forward slash-separated tuple of the location of the SED-ML file and the id of the SED output (e.g., `path/to/simulation.sedm/Table1`)',
    required: true,
    type: String,
  })  
  @ApiQuery({
    name: 'includeData',
    description: 'Whether to include the simulation results or to only return the structurre of the results (e.g., ids, names of the avaialable reports and data sets).',
    type: Boolean,
    required: false,
  })
  @ApiOkResponse({
    description: 'The simulation results were successfully retrieved',
    type: SimulationRunOutput,
  })
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
