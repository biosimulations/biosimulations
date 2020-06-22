import { Injectable } from '@nestjs/common';
import { CreateBiomodelResource } from './biomodel.dto';
import { BiomodelDB } from './biomodel.model';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType, DocumentType } from '@typegoose/typegoose';
import { timeStamp } from 'console';

@Injectable()
export class ModelsService {
  constructor(
    @InjectModel(BiomodelDB)
    private readonly biomodel: ReturnModelType<typeof BiomodelDB>,
  ) {}

  async createNewBiomodel(model: CreateBiomodelResource) {
    console.log(model);
    const createdBiomodel = await new this.biomodel(new BiomodelDB(model));

    return createdBiomodel.save();
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
