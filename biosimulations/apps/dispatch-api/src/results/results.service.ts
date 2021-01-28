/**
 * @file Service for implementing the methods of the controller. Relies on the mongoose model for results being injected.
 * @author Bilal Shaikh
 * @copyright Biosimulations Team, 2020
 * @license MIT
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ResultsModel } from './results.model';
import { BiosimulationsException } from '@biosimulations/shared/exceptions';
import {
  SimulationRunReport,
  SimulationRunReportData,
  SimulationRunResults,
} from '@biosimulations/dispatch/api-models';

@Injectable()
export class ResultsService {
  public constructor(
    @InjectModel(ResultsModel.name) private resultModel: Model<ResultsModel>,
  ) {}

  public createReport(
    simId: string,
    reportId: string,
    data: SimulationRunReportData,
  ): Promise<SimulationRunReport> {
    const result = new this.resultModel({
      simId: simId,
      reportId: reportId,
      data: data,
    });

    return result.save();
  }

  public downloadReport(simId: string, reportId: string) {
    throw new BiosimulationsException(
      500,
      'Not Yet Implemented',
      'Sorry, this method is not yet available',
    );
  }
  public async getResultReport(
    simId: string,
    reportId: string,
    sparse = false,
  ): Promise<ResultsModel> {
    let response = await this.resultModel.findOne({ simId, reportId });
    if (!response) {
      throw new NotFoundException();
    } else {
      if (sparse) {
        response = this.makeSparse(response);
      }
      return response;
    }
  }

  private makeSparse(response: ResultsModel): ResultsModel {
    const sparseResult:
      | { [key: string]: boolean[] }
      | { [key: string]: number[] } = {};
    for (const key of Object.keys(response.data)) {
      sparseResult[key] = [];
    }
    response['data'] = sparseResult;
    return response;
  }

  public getResults() {
    throw new BiosimulationsException(
      500,
      'Not Yet Implemented',
      'Sorry, this method is not yet available',
    );
  }
  public async getResult(
    simId: string,
    sparse: boolean,
  ): Promise<SimulationRunResults> {
    let reports = await this.resultModel.find({ simId }).exec();

    if (!reports.length) {
      throw new NotFoundException();
    }

    if (sparse) {
      reports = reports.map(this.makeSparse);
    }
    const response = { simId: simId, reports: reports };
    return response;
  }
  public download(id: string) {
    throw new BiosimulationsException(
      500,
      'Not Yet Implemented',
      'Sorry, this method is not yet available',
    );
  }
  public addResults(results: any) {
    throw new BiosimulationsException(
      500,
      'Not Yet Implemented',
      'Sorry, this method is not yet available',
    );
  }
  public editResults(id: string, results: any) {
    throw new BiosimulationsException(
      500,
      'Not Yet Implemented',
      'Sorry, this method is not yet available',
    );
  }
  public deleteAll() {
    throw new BiosimulationsException(
      500,
      'Not Yet Implemented',
      'Sorry, this method is not yet available',
    );
  }
  public delete(id: string) {
    throw new BiosimulationsException(
      500,
      'Not Yet Implemented',
      'Sorry, this method is not yet available',
    );
  }
}
