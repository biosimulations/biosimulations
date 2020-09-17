import { Injectable } from '@nestjs/common';

import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import {
  DispatchSimulationModelDB as DSimMDB,
  DispatchSimulationModel as DSimModel,
} from '@biosimulations/dispatch/api-models';

@Injectable()
export class ModelsService {
  constructor(
    @InjectModel(DSimMDB)
    private readonly dispatchSimulationModel: ReturnModelType<typeof DSimMDB>
  ) {}

  async createNewDispatchSimulationModel(model: DSimModel) {
    const createdDispatchSimulationModel = new this.dispatchSimulationModel(
      new DSimMDB(model)
    ).save();
    return createdDispatchSimulationModel;
  }
  async search(): Promise<DSimMDB[] | null> {
    return this.dispatchSimulationModel.find().lean();
  }

  async get(id: string): Promise<DSimMDB | null> {
    return this.dispatchSimulationModel.findOne({ id });
  }
  async deleteAll() {
    return this.dispatchSimulationModel.deleteMany({});
  }
}
