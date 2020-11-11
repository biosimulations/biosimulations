import {
  BadRequestException,
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SimulationRun, UpdateSimulationRun } from './simulation-run.dto';
import { SimulationFile, SimulationFileSchema } from './file.model';
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
  async download(
    id: string
  ): Promise<{
    size: number;
    buffer: Buffer;
    originalname: string;
    mimetype: string;
    encoding: string;
  }> {
    const file = await this.simulationRunModel.findById(id, { file: 1 }).exec();

    const fileId = (file?.file as any) as string;

    if (!!fileId) {
      const SimFile = await this.fileModel
        .findOne(
          { _id: fileId },
          { size: 1, mimetype: 1, buffer: 1, originalname: 1, encoding: 1 }
        )
        .exec();
      if (!!SimFile) {
        return {
          size: SimFile.size,
          mimetype: SimFile.mimetype,
          buffer: Buffer.from(SimFile.buffer.buffer),
          encoding: SimFile.encoding,
          originalname: SimFile.originalname,
        };
      } else {
        throw new NotFoundException('File not found');
      }
    } else {
      throw new NotFoundException(`No SimulationRun with id ${id} found`);
    }
  }
  deleteAll(id: string) {
    throw new MethodNotAllowedException('Cannot call this method');
  }
  delete(id: string) {
    throw new MethodNotAllowedException('Cannot call this method');
  }
  update(id: string, run: UpdateSimulationRun) {
    throw new MethodNotAllowedException('Cannot call this method');
  }
  async getAll() {
    return (await this.simulationRunModel.find().lean().exec()).map(toApi);
  }
  get(id: string) {
    throw new MethodNotAllowedException('Cannot call this method');
  }
  async createRun(run: SimulationRun, file: any): Promise<SimulationRunModel> {
    const fileParsed = {
      originalname: file.originalname,
      encoding: file.encoding,
      mimetype: file.mimetype,
      buffer: file.buffer,
      size: file.size,
    };

    const newFile = new this.fileModel(fileParsed);
    const newSimulationRun = new this.simulationRunModel(run);
    newSimulationRun.id = newSimulationRun._id;
    newSimulationRun.file = newFile;
    newSimulationRun.depopulate('file');

    const filePromise = newFile.save();
    const modelPromise = newSimulationRun.save();

    // TODO determine if there is a better way to do this. Need to ensure that file is saved properly, if not delete the model entry
    // Unclear if I should use a promise.all here. Since promise is created before await, this should be efficient either way.
    // The method will probably? still return even if the new run is removed. That would need to be fixed to retun an error instead
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
