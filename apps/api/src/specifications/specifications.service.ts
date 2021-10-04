import { SimulationRunSpecifications } from '@biosimulations/datamodel/api';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SpecificationsModel } from './specifications.model';

@Injectable()
export class SpecificationsService {
  private logger = new Logger(SpecificationsModel.name);
  constructor(
    @InjectModel(SpecificationsModel.name)
    private model: Model<SpecificationsModel>,
  ) {}

  public async getSpecifications() {
    return this.model.find({}).exec();
  }

  /**
   *
   * @param id The id of the simulation run
   * @returns An array of specs for the simualtion run
   */
  public async getSimulationSpecs(id: string): Promise<SpecificationsModel[]> {
    const specs = await this.model.find({ simulationId: id }).exec();
    return specs;
  }

  public async createSpecs(
    specs: SimulationRunSpecifications[],
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
