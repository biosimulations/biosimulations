import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { SimulationIdMap } from './schemas/simulation-id-map.schema';
import { Model } from 'mongoose';

@Injectable()
export class SimulationIdMapService {
  constructor(
    @InjectModel(SimulationIdMap.name)
    private simIdMapModel: Model<SimulationIdMap>
  ) {}

  async create(createSimIdMap: {
    uuid: string;
    projectName: string;
  }): Promise<{ uuid: string; projectName: string }> {
    const createdSimIdMap = new this.simIdMapModel(createSimIdMap);
    return createdSimIdMap.save();
  }

  async find(uuid: string): Promise<SimulationIdMap> {
    return this.simIdMapModel.$where(`this.uuid === ${uuid}`).exec();
  }
}
