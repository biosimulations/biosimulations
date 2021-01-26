import {
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Simulator } from '@biosimulations/simulators/database-models';
import { Simulator as APISimulator } from '@biosimulations/simulators/api-models';
import { Model } from 'mongoose';

@Injectable()
export class SimulatorsService {
  validate(doc: APISimulator) {
    const sim = new this.simulator(doc);
    return sim.validate();
  }
  constructor(
    @InjectModel(Simulator.name) private simulator: Model<Simulator>,
  ) {}

  async findAll(): Promise<Simulator[]> {
    const results = await this.simulator
      .find({}, { _id: 0, __v: 0 })
      .lean()
      .exec();

    //results.forEach((value) => value.toJSON());
    return results as Simulator[];
  }
  async findAllLatest() {
    const all = this.simulator.find({}, { _id: 0, __v: 0 }).lean().exec();
    return all;
  }
  async findById(id: string) {
    return this.simulator.find({ id: id }, { _id: 0, __v: 0 }).lean().exec();
  }
  async findByVersion(id: string, version: string): Promise<Simulator | null> {
    return this.simulator
      .findOne({ id: id, version: version }, { _id: 0, __v: 0 })
      .exec();
  }

  async new(doc: APISimulator): Promise<Simulator> {
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

  async replace(
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

    sim.overwrite(doc);
    const res = sim.save();
    return res;
  }

  async deleteOne(id: string, version: string): Promise<Simulator> {
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

  async deleteMany(id: string) {
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
  async deleteAll() {
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
