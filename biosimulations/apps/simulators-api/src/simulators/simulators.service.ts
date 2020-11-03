import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Simulator } from '@biosimulations/simulators/api-models';
import { Model } from 'mongoose';
import { assert } from 'console';

@Injectable()
export class SimulatorsService {
  validate(doc: Simulator) {
    const sim = new this.simulator(doc);
    return sim.validate();
  }
  constructor(
    @InjectModel(Simulator.name) private simulator: Model<Simulator>
  ) {}

  async findAll(): Promise<Simulator[]> {
    const results = await this.simulator
      .find({}, { _id: 0, __v: 0 })
      .lean()
      .exec();
    // TODO remove the cast, and change return type to simulator interface
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

  async new(doc: Simulator): Promise<Simulator[]> {
    const sim = new this.simulator(doc);
    let res: Simulator[];
    try {
      res = (await sim.save()).toJSON({ versionKey: false });
    } catch (e) {
      if (e.name == 'MongoError' && e.code == 11000) {
        throw new ConflictException(
          `Simulator with id: ${e?.keyValue?.id}, version: ${e?.keyValue?.version} already exists`
        );
      } else {
        console.log(e);
        throw new ConflictException(`Database Error: ${e?.message}`);
      }
    }
    return res;
  }
  
  async replace(
    id: string,
    version: string,
    doc: Simulator
  ): Promise<Simulator> {
    const sim = await this.simulator
      .findOne({ id: id, version: version })
      .exec();

    if (!sim) {
      throw new NotFoundException(
        `No simulator with id ${id} and version ${version}`
      );
    }

    sim.overwrite(doc);
    const res = sim.save();
    return res;
  }

  async delete(
    id: string,
    version: string
  ): Promise<Simulator> {
    const sim = await this.simulator
      .findOne({ id: id, version: version })
      .exec();

    if (!sim) {
      throw new NotFoundException(
        `No simulator with id ${id} and version ${version}`
      );
    }

    return sim.remove();
  }
}
