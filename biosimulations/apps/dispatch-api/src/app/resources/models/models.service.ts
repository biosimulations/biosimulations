import { Injectable } from '@nestjs/common';

import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import {
  DispatchSimulationModelDB as DSimMDB,
  DispatchSimulationModel as DSimModel,
  DispatchSimulationStatus,
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

  async get(uuid: string): Promise<DSimMDB | null> {
    return this.dispatchSimulationModel.findOne({ uuid });
  }
  async deleteAll() {
    return this.dispatchSimulationModel.deleteMany({});
  }

  async updateStatus(uuid: string, status: DispatchSimulationStatus) {
    const doc = await this.dispatchSimulationModel.findOne({ uuid });
    if (doc !== null) {
      doc.currentStatus = status;
      doc.statusModifiedTime = new Date();
      doc.duration =
        (doc.statusModifiedTime.getTime() - doc.submittedTime.getTime()) / 1000;
      await doc.save();
    }
  }

  async getData(uuids: string[]) {
    return this.dispatchSimulationModel.find({
      uuid: { $in: uuids },
    });
  }
}
