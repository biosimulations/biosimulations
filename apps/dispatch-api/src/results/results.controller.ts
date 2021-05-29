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
import { response, Response } from 'express';
import { ResultsData, ResultsModel } from './results.model';

import { ResultsService } from './results.service';

import { pluck } from 'rxjs/operators';
@Controller('results')
@ApiTags('Results')
export class ResultsController {
  public constructor(
    private service: ResultsService, // private dataSetService: DatasetService,
  ) {}

  @UseGuards(JwtGuard, PermissionsGuard)
  @permissions('read:SimulationRunResults')
  @Get()
  public async getResults(): Promise<SimulationRunResults[]> {
    const results = await this.service.getResults();
    const reports = results.map(this.convertReport);
    const allResults = results.map((value) => {
      return { simId: value.simId, reports: reports };
    });

    return allResults;
  }

  @Get(':simId/reportnames')
  public async getReportNames(
    @Param('simId')
    simId: string,
  ) {
    // const dataset = this.dataSetService
    //   .datasetsGet('application/json', simId)
    //   .pipe(pluck('data'));
    const dataset = 'test';
    return dataset;
  }
  @Get(':simId/download')
  public async downloadResultReport(
    @Param('simId') simId: string,
    @Res() res: Response,
  ): Promise<void> {
    const file = await this.service.download(simId);
    res.contentType('application/x-hdf5');
    res.setHeader('Content-Disposition', 'attachment; filename="results.h5"');
    res.write(file);
    res.send();
  }

  @Get(':simId')
  @ApiQuery({ name: 'sparse', type: Boolean })
  public async getResult(
    @Param('simId') simId: string,
    @Query('sparse', ParseBoolPipe) sparse = true,
  ): Promise<SimulationRunResults> {
    const reports = await this.service.getResult(simId, sparse);
    const arrReports = reports.map(this.convertReport, this);
    return { simId: simId, reports: arrReports };
  }

  @Get(':simId/:reportId')
  @ApiQuery({ name: 'sparse', type: Boolean })
  public async getResultReport(
    @Param('simId') simId: string,
    @Param('reportId') reportId: string,
    @Query('sparse', ParseBoolPipe) sparse = true,
  ): Promise<SimulationRunReport> {
    const resultModel = await this.service.getResultReport(
      simId,
      reportId,
      sparse,
    );
    const model = this.convertReport(resultModel);

    return model;
  }

  @Post(':simId/:reportId')
  @ApiBody({ schema: CreateSimulationRunReportSchema })
  @ApiCreatedResponse({ type: () => SimulationRunReport })
  @permissions('write:Results')
  public async postResultReport(
    @Param('simId') simId: string,
    @Param('reportId') reportId: string,
    @Body()
    data: SimulationRunReportDataStrings,
  ): Promise<SimulationRunReport> {
    const report: ResultsData = {};
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

    return this.convertReport(
      await this.service.createReport(simId, reportId, report),
    );
  }

  @UseGuards(JwtGuard, PermissionsGuard)
  @permissions('delete:Results')
  @Delete()
  public deleteResults(): void {
    return this.service.deleteAll();
  }
  @UseGuards(JwtGuard, PermissionsGuard)
  @permissions('delete:Results')
  @Delete(':simId')
  public deleteResult(@Param('simId') simId: string): void {
    return this.service.delete(simId);
  }

  @UseGuards(JwtGuard, PermissionsGuard)
  @permissions('delete:Results')
  @Delete(':simId/:reportId')
  public deleteResultReport(
    @Param('simId') simId: string,
    @Param('reportId') reportId: string,
  ): void {
    return this.service.delete(simId);
  }

  // TODO move this conversion to the write side after parsing hdf files
  private convertData(
    data: ResultsData,
    reportId: string,
  ): SimulationRunReportData {
    const dataArr = [];
    for (const prop in data) {
      dataArr.push({
        id: `${reportId}/${prop}`,
        values: data[prop],
        label: prop,
      });
    }
    return dataArr;
  }

  private convertReport(convertReport: ResultsModel): SimulationRunReport {
    const data = this.convertData(convertReport.data, convertReport.reportId);
    return {
      created: convertReport.created,
      updated: convertReport.updated,
      simId: convertReport.simId,
      reportId: convertReport.reportId,
      data: data,
    };
  }
}
