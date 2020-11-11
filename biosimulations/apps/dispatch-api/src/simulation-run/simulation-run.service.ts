import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SimulationRun, UpdateSimulationRun } from './simulation-run.dto';
import { SimulationFile } from './file.model';
import { Model, Mongoose } from 'mongoose';
import {
  SimulationRunModel,
  SimulationRunModelSchema,
} from './simulation-run.model';
const toApi = (obj: any) => {
  delete obj.__v;
  delete obj._id;
  return obj;
};
@Injectable()
export class SimulationRunService {
  deleteAll(id: string) {
    throw new Error('Method not implemented.');
  }
  delete(id: string) {
    throw new Error('Method not implemented.');
  }
  update(id: string, run: UpdateSimulationRun) {
    throw new Error('Method not implemented.');
  }
  async getAll() {
    return (await this.simulationRunModel.find().lean().exec()).map(toApi);
  }
  get(id: string) {
    throw new Error('Method not implemented.');
  }
  async createRun(run: SimulationRun, file: any): Promise<SimulationRunModel> {
    const fileParsed = {
      originalname: file.originalname,
      encoding: file.encoding,
      mimetype: file.mimetype,
      buffer: file.buffer,
      size: file.size,
    };

    let newFile = new this.fileModel(fileParsed);
    const newSimulationRun = new this.simulationRunModel(run);
    newSimulationRun.id = newSimulationRun._id;
    newSimulationRun.file = newFile;
    newSimulationRun.depopulate('file');

    const filePromise = newFile.save();
    const modelPromise = newSimulationRun.save();

    // TODO determine if there is a better way to do this. Need to ensure that file is saved properly, if not delete the model entry
    // Unclear if I should use a promise.all here. Since promise is created before await, this should be efficient either way.

    filePromise.catch((reason) => {
      newSimulationRun.remove();
    });

    const modelRes = await modelPromise;
    const fileRes = await filePromise;
    return modelRes;
  }
  constructor(
    @InjectModel(SimulationFile.name) private fileModel: Model<SimulationFile>,
    @InjectModel(SimulationRunModel.name)
    private simulationRunModel: Model<SimulationRunModel>
  ) {}
}
