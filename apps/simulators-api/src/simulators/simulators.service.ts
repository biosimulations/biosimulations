import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Simulator } from '@biosimulations/simulators/database-models';
import { Simulator as APISimulator } from '@biosimulations/datamodel/api';
import { LeanDocument, Model } from 'mongoose';
import { DeleteResult } from 'mongodb';

@Injectable()
export class SimulatorsService {
  validate(doc: APISimulator) {
    const sim = new this.simulator(doc);
    return sim.validate();
  }
  constructor(
    @InjectModel(Simulator.name) private simulator: Model<Simulator>,
  ) {}

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
    const res: Simulator = (await sim.save()).toJSON({
      versionKey: false,
    }) as Simulator;
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
        `No simulation tool has id '${id}' and version '${version}'`,
      );
    }
    // Preserve the original date
    doc.biosimulators.created = sim.biosimulators.created;
    sim.overwrite(doc);
    const res = sim.save();
    return res;
  }

  public async deleteOne(id: string, version: string): Promise<Simulator> {
    const sim = await this.simulator
      .findOne({ id: id, version: version }, { _id: 0, __v: 0 })
      .exec();

    if (!sim) {
      throw new NotFoundException(
        `No simulation tool has id '${id}' and version '${version}'`,
      );
    }
    const res: DeleteResult = await this.simulator
      .deleteOne({ id: id, version: version })
      .exec();

    if (res.deletedCount !== 1) {
      throw new InternalServerErrorException(
        'The version of the simulation tool could not be deleted',
      );
    }

    return sim;
  }

  public async deleteMany(id: string): Promise<void> {
    let numVersions = await this.simulator.count({ id }).exec();
    if (numVersions === 0) {
      throw new NotFoundException(`No simulation tool has id '${id}'`);
    }

    const res = await this.simulator.deleteMany({ id: id }).exec();

    numVersions = await this.simulator.count({ id }).exec();
    if (numVersions !== 0) {
      throw new InternalServerErrorException(
        'Some versions of the simulation tool could not be deleted',
      );
    }
  }

  public async deleteAll(): Promise<void> {
    const sims = await this.simulator.deleteMany({});
    const count = await this.simulator.count();
    if (count !== 0) {
      throw new InternalServerErrorException(
        'Some simulation tools could not be deleted',
      );
    }
  }
}
