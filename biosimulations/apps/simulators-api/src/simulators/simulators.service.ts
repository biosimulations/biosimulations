import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Simulator } from '@biosimulations/simulators/api-models';
import { Model } from 'mongoose';

@Injectable()
export class SimulatorsService {
  constructor(
    @InjectModel(Simulator.name) private simulator: Model<Simulator>
  ) {}

  async findAll() {
    return this.simulator.find().lean();
  }
  async findAllLatest() {
    const all = this.simulator.find({}).lean();
  }
  async new(doc: Simulator) {
    const sim = new this.simulator(doc);
    return sim.save();
  }
}
