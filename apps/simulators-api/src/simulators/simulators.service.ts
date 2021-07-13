import {
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Simulator } from '@biosimulations/simulators/database-models';
import { Simulator as APISimulator } from '@biosimulations/simulators/api-models';
import { LeanDocument, Model } from 'mongoose';

@Injectable()
export class SimulatorsService {
  validate(doc: APISimulator) {
    const sim = new this.simulator(doc);
    return sim.validate();
  }
  constructor(
    @InjectModel(Simulator.name) private simulator: Model<Simulator>,
  ) {}

  // TODO Combine find methods, just use optional args
  public async findAll(
    includeTestResults = false,
  ): Promise<LeanDocument<Simulator>[]> {
    let projection: any = {
      _id: 0,
      __v: 0,
      'biosimulators.validationTests': 0,
    };
    if (includeTestResults) {
      projection = { _id: 0, __v: 0 };
    }
    const results = await this.simulator.find({}, projection).lean().exec();

    //results.forEach((value) => value.toJSON());
    return results;
  }

  public async findById(
    id: string,
    includeTestResults = false,
  ): Promise<LeanDocument<Simulator>[]> {
    let projection: any = {
      _id: 0,
      __v: 0,
      'biosimulators.validationTests': 0,
    };
    if (includeTestResults) {
      projection = { _id: 0, __v: 0 };
    }
    return this.simulator.find({ id: id }, projection).lean().exec();
  }
  public async findByVersion(
    id: string,
    version: string,
    includeTestResults = false,
  ): Promise<Simulator | null> {
    let projection: any = {
      _id: 0,
      __v: 0,
      'biosimulators.validationTests': 0,
    };
    if (includeTestResults) {
      projection = { _id: 0, __v: 0 };
    }
    return this.simulator
      .findOne({ id: id, version: version }, projection)
      .exec();
  }

  public async new(doc: APISimulator): Promise<Simulator> {
    const sim = new this.simulator(doc);
    let res: Simulator;
    try {
      res = (await sim.save()).toJSON({ versionKey: false }) as Simulator;
    } catch (e) {
      if (e.name == 'MongoError' && e.code == 11000) {
        throw new ConflictException(
          `Simulator with id: ${e?.keyValue?.id}, version: ${e?.keyValue?.version} already exists`,
        );
      } else {
        // Will be caught by other filters
        console.log(e);
        throw e;
      }
    }
    return res;
  }

  public async replace(
    id: string,
    version: string,
    doc: APISimulator,
  ): Promise<Simulator> {
    const sim = await this.simulator
      .findOne({ id: id, version: version })
      .exec();

    if (!sim) {
      throw new NotFoundException(
        `No simulator with id ${id} and version ${version}`,
      );
    }
    const created = sim.biosimulators.created;
    sim.overwrite(doc);
    // Preserve the original date
    sim.biosimulators.created = created;
    const res = sim.save();
    return res;
  }

  public async deleteOne(id: string, version: string): Promise<Simulator> {
    const sim = await this.simulator
      .findOne({ id: id, version: version }, { _id: 0, __v: 0 })
      .exec();

    if (!sim) {
      throw new NotFoundException(
        `No simulator with id ${id} and version ${version}`,
      );
    }
    const deleted = await this.simulator
      .findOneAndDelete({ id: id, version: version })
      .exec();

    return sim;
  }

  public async deleteMany(id: string): Promise<void> {
    const sims = await this.simulator.deleteMany({ id: id }).exec();
    if (sims.n == 0) {
      throw new NotFoundException(`No simulator with id ${id}`);
    } else {
      if (sims.deletedCount != sims.n) {
        throw new InternalServerErrorException(
          `Could only delete ${sims.deletedCount} out of ${sims.n} documents. Please try again`,
        );
      }
      if (!sims.ok) {
        throw new InternalServerErrorException('Operation Failed');
      }
    }
  }
  public async deleteAll(): Promise<void> {
    const sims = await this.simulator.deleteMany({});
    if (sims.deletedCount != sims.n) {
      throw new InternalServerErrorException(
        `Could only delete ${sims.deletedCount} out of ${sims.n} documents. Please try again`,
      );
    }
    if (!sims.ok) {
      throw new InternalServerErrorException('Operation Failed');
    }
  }
}
