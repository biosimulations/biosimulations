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
  SimulationRunReport,
  SimulationRunReportData,
  SimulationRunReportDataSchema,
  SimulationRunReportDataStrings,
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
  ApiOAuth2,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
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
    @Query('sparse', ParseBoolPipe) sparse = true,
  ) {
    return this.service.getResult(simId, sparse);
  }

  @Get(':simId/download')
  async downloadResult(@Param('simId') simId: string, @Res() res: any) {
    const file = this.service.download(simId);
    res.contentType('application/x-hdf5');
    res.write(file);
    res.send();
  }

  @Get(':simId/:reportId')
  @ApiQuery({ name: 'sparse', type: Boolean })
  getResultReport(
    @Param('simId') simId: string,
    @Param('reportId') reportId: string,
    @Query('sparse', ParseBoolPipe) sparse = true,
  ) {
    return this.service.getResultReport(simId, reportId, sparse);
  }

  @Get(':simId/download')
  async downloadResultReport(
    @Param('simId') simId: string,

    @Res() res: Response,
  ) {
    const file = await this.service.download(simId);
    res.contentType('application/x-hdf5');
    res.setHeader('Content-Disposition', 'attachment; filename="results.h5"');
    res.write(file);
    res.send();
  }

  @Post(':simId/:reportId')
  @ApiBody({ schema: SimulationRunReportDataSchema })
  @ApiCreatedResponse({ type: () => SimulationRunReport })
  @permissions('write:Results')
  @ApiOAuth2(['write:Results'])
  postResultReport(
    @Param('simId') simId: string,
    @Param('reportId') reportId: string,
    @Body()
    data: SimulationRunReportDataStrings,
  ): Promise<SimulationRunReport> {
    const report: SimulationRunReportData = {};
    for (const key of Object.keys(data)) {
      const arr = data[key];
      const firstValue = String(arr[0]).toLowerCase().trim();

      if (firstValue == 'true' || firstValue == 'false') {
        const newArr = arr.map((value) => {
          value = String(value).toLowerCase().trim();
          if (value != 'true' && value != 'false') {
            throw new BiosimulationsException(
              HttpStatus.BAD_REQUEST,
              'Parse Error',
              `Inconsistent datatypes for key `,
              undefined,
              undefined,
              `/${key}`,
            );
          }
          return Boolean(value);
        });
        report[key] = newArr;
      } else {
        const newArr = arr.map((value) => {
          const num = Number(value);
          if (isNaN(num)) {
            throw new BiosimulationsException(
              HttpStatus.BAD_REQUEST,
              'Parse Error',
              `Inconsistent datatypes for key `,
              undefined,
              undefined,
              `/${key}`,
            );
          }
          return num;
        });
        report[key] = newArr;
      }
    }

    return this.service.createReport(simId, reportId, report);
  }

  @UseGuards(JwtGuard, PermissionsGuard)
  @permissions('delete:Results')
  @ApiOAuth2(['delete:Results'])
  @Delete()
  deleteResults() {
    return this.service.deleteAll();
  }
  @UseGuards(JwtGuard, PermissionsGuard)
  @permissions('delete:Results')
  @ApiOAuth2(['delete:Results'])
  @Delete(':simId')
  deleteResult(@Param('simId') simId: string) {
    return this.service.delete(simId);
  }

  @UseGuards(JwtGuard, PermissionsGuard)
  @permissions('delete:Results')
  @ApiOAuth2(['delete:Results'])
  @Delete(':simId/:resultId')
  deleteResultReport(
    @Param('simId') simId: string,
    @Param('reportId') reportId: string,
  ) {
    return this.service.delete(simId);
  }
}
