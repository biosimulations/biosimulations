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

const result = {
  data_set_time: [
    '0.1',
    '0.105',
    '0.11',
    '0.115',
    '0.12',
    '0.125',
    '0.13',
    '0.135',
    '0.14',
    '0.145',
    '0.15',
    '0.155',
    '0.16',
    '0.165',
    '0.17',
    '0.17500000000000002',
    '0.18',
    '0.185',
    '0.19',
    '0.195',
    '0.2',
  ],
  data_set_BE: [
    '0.0007766381772963218',
    '0.0008032879490192023',
    '0.000829930865005981',
    '0.0008565664748179747',
    '0.0008831943356018968',
    '0.00090981401211303',
    '0.0009364250769598475',
    '0.0009630271103191858',
    '0.0009896197002247867',
    '0.0010162024425600885',
    '0.0010427749411200844',
    '0.0010693368076431027',
    '0.0010958876619202704',
    '0.001122427131788085',
    '0.0011489548532160308',
    '0.0011754704703498403',
    '0.0012019736355303962',
    '0.0012284640094393504',
    '0.001254941261025384',
    '0.0012814050676162323',
    '0.0013078551149393962',
  ],
  data_set_BUD: [
    '0.0',
    '0.0',
    '0.0',
    '0.0',
    '0.0',
    '0.0',
    '0.0',
    '0.0',
    '0.0',
    '0.0',
    '0.0',
    '0.0',
    '0.0',
    '0.0',
    '0.0',
    '0.0',
    '0.0',
    '0.0',
    '0.0',
    '0.0',
    '0.0',
  ],
  data_set_Cdc20: [
    '1.1368510063392174',
    '1.1350526491218655',
    '1.1332523782164177',
    '1.1314502988827446',
    '1.1296465144220629',
    '1.1278411261749646',
    '1.1260342334656956',
    '1.1242259336853717',
    '1.1224163222310468',
    '1.1206054925216367',
    '1.1187935359997914',
    '1.1169805421428207',
    '1.1151665984562653',
    '1.1133517904989083',
    '1.1115362018849941',
    '1.1097199142992038',
    '1.1079030075180722',
    '1.1060855594032253',
    '1.1042676459466376',
    '1.1024493412733827',
    '1.1006307176652956',
  ],
};
@Injectable()
export class ResultsService {
  constructor(
    @InjectModel(ResultsModel.name) private resultModel: Model<ResultsModel>,
  ) {}

  createReport(
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

  downloadReport(simId: string, reportId: string) {
    throw new BiosimulationsException(
      500,
      'Not Yet Implemented',
      'Sorry, this method is not yet available',
    );
  }
  async getResultReport(simId: string, reportId: string, sparse = false) {
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

  getResults() {
    throw new BiosimulationsException(
      500,
      'Not Yet Implemented',
      'Sorry, this method is not yet available',
    );
  }
  async getResult(
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
  download(id: string) {
    throw new BiosimulationsException(
      500,
      'Not Yet Implemented',
      'Sorry, this method is not yet available',
    );
  }
  addResults(results: any) {
    throw new BiosimulationsException(
      500,
      'Not Yet Implemented',
      'Sorry, this method is not yet available',
    );
  }
  editResults(id: string, results: any) {
    throw new BiosimulationsException(
      500,
      'Not Yet Implemented',
      'Sorry, this method is not yet available',
    );
  }
  deleteAll() {
    throw new BiosimulationsException(
      500,
      'Not Yet Implemented',
      'Sorry, this method is not yet available',
    );
  }
  delete(id: string) {
    throw new BiosimulationsException(
      500,
      'Not Yet Implemented',
      'Sorry, this method is not yet available',
    );
  }
}
