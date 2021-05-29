import { Injectable } from '@nestjs/common';

import { Model as BiomodelDB } from './biomodel.model';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { CreateModelResource } from '@biosimulations/platform/api-models';

/**
 * Model Service
 * Accesses the database to create/save/delete models.
 */
@Injectable()
export class ModelsService {
  constructor(
    @InjectModel(BiomodelDB)
    private readonly biomodel: ReturnModelType<typeof BiomodelDB>,
  ) {}

  async createNewBiomodel(model: CreateModelResource) {
    const createdBiomodel = new this.biomodel(new BiomodelDB(model)).save();
    return createdBiomodel;
  }
  async search(): Promise<BiomodelDB[] | null> {
    // Return as lean to return a POJO! Otherwise, each response is converted to a mongoose document
    return this.biomodel.find().lean();
  }

  async get(id: string): Promise<BiomodelDB | null> {
    return this.biomodel.findOne({ id });
  }
  async deleteAll() {
    return this.biomodel.deleteMany({});
  }
}
