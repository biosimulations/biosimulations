import { Injectable } from '@nestjs/common';

import { BiomodelDB } from './biomodel.model';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType, DocumentType } from '@typegoose/typegoose';
import { timeStamp } from 'console';
import { CreateModelResource } from '@biosimulations/datamodel/api';

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
    const createdBiomodel = await new this.biomodel(
      new BiomodelDB(model),
    ).save();
    return createdBiomodel;
  }
  async search(): Promise<BiomodelDB[] | null> {
    return await this.biomodel.find();
  }

  async get(id: string): Promise<BiomodelDB | null> {
    return this.biomodel.findOne({ id });
  }
  async deleteAll() {
    return await this.biomodel.deleteMany({});
  }
}
