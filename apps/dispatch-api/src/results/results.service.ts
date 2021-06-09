/**
 * @file Service for implementing the methods of the controller. Relies on the mongoose model for results being injected.
 * @author Bilal Shaikh
 * @copyright Biosimulations Team, 2020
 * @license MIT
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ResultsModel, ResultsData } from './results.model';
import { BiosimulationsException } from '@biosimulations/shared/exceptions';
import { SharedStorageService } from '@biosimulations/shared/storage';
import { S3 } from 'aws-sdk';

@Injectable()
export class ResultsService {
  public constructor(
    private storage: SharedStorageService,
    @InjectModel(ResultsModel.name) private resultModel: Model<ResultsModel>,
  ) {}

  public createReport(
    simId: string,
    reportId: string,
    data: ResultsData,
  ): Promise<ResultsModel> {
    const result = new this.resultModel({
      simId: simId,
      reportId: reportId,
      data: data,
    });

    return result.save();
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

  public async getResults(): Promise<ResultsModel[]> {
    const results = await this.resultModel.find({}).exec();
    return results;
  }
  public async getResult(
    simId: string,
    sparse: boolean,
  ): Promise<ResultsModel[]> {
    let reports = await this.resultModel.find({ simId }).exec();

    if (!reports.length) {
      throw new NotFoundException();
    }

    if (sparse) {
      reports = reports.map(this.makeSparse);
    }

    return reports;
  }
  public async download(simId: string): Promise<S3.Body | undefined> {
    const file = await this.storage.getObject(
      'simulations/' + simId + '/' + simId + '.zip',
    ); // TODO remove harcoded path
    return file.Body;
  }
  public addResults(results: any): void {
    throw new BiosimulationsException(
      500,
      'Not Yet Implemented',
      'Sorry, this method is not yet available',
    );
  }
  public editResults(id: string, results: any): void {
    throw new BiosimulationsException(
      500,
      'Not Yet Implemented',
      'Sorry, this method is not yet available',
    );
  }
  public deleteAll(): void {
    throw new BiosimulationsException(
      500,
      'Not Yet Implemented',
      'Sorry, this method is not yet available',
    );
  }
  public delete(id: string): void {
    throw new BiosimulationsException(
      500,
      'Not Yet Implemented',
      'Sorry, this method is not yet available',
    );
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
}
