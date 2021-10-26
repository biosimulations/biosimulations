import { SimulationRunSedDocument } from '@biosimulations/datamodel/api';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SpecificationsModel } from './specifications.model';

@Injectable()
export class SpecificationsService {
  private logger = new Logger(SpecificationsModel.name);
  public constructor(
    @InjectModel(SpecificationsModel.name)
    private model: Model<SpecificationsModel>,
  ) {}

  public async getSpecification(
    simId: string,
    specId: string,
  ): Promise<SpecificationsModel | null> {
    return this.model.findOne({ simulationRun: simId, id: specId }).exec();
  }
  public async getSpecificationsBySimulation(
    simId: string,
  ): Promise<SpecificationsModel[]> {
    return this.model.find({ simulationRun: simId }).exec();
  }
  public async getSpecifications(): Promise<SpecificationsModel[]> {
    return this.model.find({}).exec();
  }

  public async createSpecs(
    specs: SimulationRunSedDocument[],
  ): Promise<SpecificationsModel[]> {
    const createdSpecs = [];
    for (const spec of specs) {
      const newSpec = new this.model(spec);
      await newSpec.save();
      createdSpecs.push(newSpec.save());
    }
    return Promise.all(createdSpecs);
  }
}
