import { SimulationRunSedDocumentInput } from '@biosimulations/ontology/datamodel';
import { SedElementType } from '@biosimulations/datamodel/common';
import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document, Query } from 'mongoose';
import { SpecificationsModel } from './specifications.model';
import { DeleteResult } from 'mongodb';

@Injectable()
export class SpecificationsService {
  private logger = new Logger(SpecificationsModel.name);

  public constructor(
    @InjectModel(SpecificationsModel.name)
    private model: Model<SpecificationsModel>,
  ) {}

  public async getElementSpecification(
    runId: string,
    experimentLocation: string,
    elementType: SedElementType,
    elementId: string,
  ): Promise<any | null> {
    let attribute!: string;
    switch (elementType) {
      case SedElementType.SedModel: {
        attribute = 'models';
        break;
      }
      case SedElementType.SedSimulation: {
        attribute = 'simulations';
        break;
      }
      case SedElementType.SedTask: {
        attribute = 'tasks';
        break;
      }
      case SedElementType.SedDataGenerator: {
        attribute = 'dataGenerators';
        break;
      }
      case SedElementType.SedOutput: {
        attribute = 'outputs';
        break;
      }
    }

    const specs = await this.querySpecification(runId, experimentLocation)
      .select(attribute)
      .exec();

    if (specs) {
      for (const element of specs.get(attribute)) {
        if (element.id === elementId) {
          return element;
        }
      }
    }

    return null;
  }

  public async getSpecification(
    runId: string,
    experimentLocation: string,
  ): Promise<SpecificationsModel | null> {
    return this.querySpecification(runId, experimentLocation).exec();
  }

  private querySpecification(
    runId: string,
    experimentLocation: string,
  ): Query<SpecificationsModel | null, Document<SpecificationsModel>> {
    experimentLocation = this.normalizeExperimentLocation(experimentLocation);
    return this.model.findOne({
      simulationRun: runId,
      $or: [{ id: experimentLocation }, { id: './' + experimentLocation }],
    });
  }

  public async getSpecificationsBySimulation(
    runId: string,
  ): Promise<SpecificationsModel[]> {
    return this.model.find({ simulationRun: runId }).exec();
  }

  public async getSpecifications(): Promise<SpecificationsModel[]> {
    return this.model.find({}).exec();
  }

  public async createSpecs(
    specs: SimulationRunSedDocumentInput[],
  ): Promise<SpecificationsModel[]> {
    const createdSpecs = [];
    for (const spec of specs) {
      const newSpec = new this.model(spec);
      await newSpec.save();
      createdSpecs.push(newSpec.save());
    }
    return Promise.all(createdSpecs);
  }

  public async deleteSimulationRunSpecifications(runId: string): Promise<void> {
    const res: DeleteResult = await this.model
      .deleteMany({ simulationRun: runId })
      .exec();
    const count = await this.model
      .find({ simulationRun: runId })
      .count()
      .exec();
    if (count !== 0) {
      throw new InternalServerErrorException(
        'Some specifications could not be deleted.',
      );
    }
  }

  /*
  public async deleteAllSpecifications(): Promise<void> {
    const res: DeleteResult = await this.model
      .deleteMany({})
      .exec();
    const count = await this.model.count();
    if (count !== 0) {
      throw new InternalServerErrorException(
        'Some specifications could not be deleted.',
      );
    }
  }
  */

  private normalizeExperimentLocation(location: string): string {
    if (location.startsWith('./')) {
      return location.substring(2);
    } else {
      return location;
    }
  }
}
