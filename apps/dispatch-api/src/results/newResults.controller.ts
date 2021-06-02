/**
 * @file Provides the controller for HTTP API for the results of simulation runs.
 *  Get/Download operations are intended for end users.
 *  Post/Modification methods are intended for other services/admin/service users.
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
  SimulationRunReport,
  SimulationRunResults,
  SimulationRunReportData,
  CreateSimulationRunReportSchema,
  SimulationRunReportDataStrings,
  SimulationRunReportDataSchema,
} from '@biosimulations/dispatch/api-models';
import { BiosimulationsException } from '@biosimulations/shared/exceptions';

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseBoolPipe,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { SimulationHDFService } from '@biosimulations/hsds/client';
import { HSDSResultsService } from './results.hsds.service';

@Controller('v2/results')
@ApiTags('HSDS Results')
export class NewResultsController {
  public constructor(
    private service: HSDSResultsService,
    private dataSetService: SimulationHDFService,
  ) {}

  @Get(':id')
  public async getResults(@Param('id') id: string) {
    return this.service.getResults(id);
  }
}
