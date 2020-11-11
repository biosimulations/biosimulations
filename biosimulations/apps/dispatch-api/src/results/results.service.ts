/**
 * @file Service for implementing the methods of the controller. Relies on the mongoose model for results being injected.
 * @author Bilal Shaikh
 * @copyright Biosimulations Team, 2020
 * @license MIT
 */
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ResultsModel } from './results.model';

@Injectable()
export class ResultsService {
  constructor(
    @InjectModel(ResultsModel.name) private fileModel: Model<ResultsModel>
  ) {}
  getResults() {
    throw new Error('Method not implemented.');
  }
  getResult(id: string) {
    throw new Error('Method not implemented.');
  }
  download(id: string) {
    throw new Error('Method not implemented.');
  }
  addResults(results: any) {
    throw new Error('Method not implemented.');
  }
  editResults(id: string, results: any) {
    throw new Error('Method not implemented.');
  }
  deleteAll() {
    throw new Error('Method not implemented.');
  }
  delete(id: string) {
    throw new Error('Method not implemented.');
  }
}
