/**
 * @file Provides methods that imnplement the CRUD operations on the Simulation Runs in the mongo database. Is used by the controller to excute the user requests from the HTTP API.
 * @author Bilal Shaikh
 * @copyright Biosimulations Team, 2020
 * @license MIT
 */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { SimulationFile, SimulationFileSchema } from './file.model';
import { Model, Mongoose } from 'mongoose';
import {
  SimulationRunModel,
  SimulationRunModelReturnType,
  SimulationRunModelSchema,
  SimulationRunModelType,
} from './simulation-run.model';
import {
  SimulationRun,
  SimulationRunStatus,
  UpdateSimulationRun,
} from '@biosimulations/dispatch/api-models';

const toApi = <T extends SimulationRunModelType>(
  obj: T
): SimulationRunModelReturnType => {
  delete obj.__v;
  delete obj._id;
  return (obj as any) as SimulationRunModelReturnType;
};

@Injectable()
export class SimulationRunService {
  logger = new Logger(SimulationRunService.name);
  setStatus(id: string, status: SimulationRunStatus) {
    return this.simulationRunModel
      .updateOne({ _id: id }, { status: status })
      .then((value) => this.logger.log(`Changed ${id} to ${status}`))
      .catch();
  }
  /**
   * Download the OMEX file for the provided id. The omex file is a ref on the object
   * @param id The id of the simulation
   *
   */
  async download(
    id: string
  ): Promise<{
    size: number;
    buffer: Buffer;
    originalname: string;
    mimetype: string;
    encoding: string;
  }> {
    // Find the simulation with the id
    const file = await this.simulationRunModel.findById(id, { file: 1 }).exec();

    //Get the id of the file
    const fileId = (file?.file as any) as string;

    if (fileId) {
      // Get the file object from the db
      const SimFile = await this.fileModel
        .findOne(
          { _id: fileId },
          { size: 1, mimetype: 1, buffer: 1, originalname: 1, encoding: 1 }
        )
        .exec();
      if (SimFile) {
        // Return the file and metadata
        return {
          size: SimFile.size,
          mimetype: SimFile.mimetype,
          buffer: Buffer.from(SimFile.buffer.buffer),
          encoding: SimFile.encoding,
          originalname: SimFile.originalname,
        };
      } else {
        // The simulator gave a file id, but not found
        throw new NotFoundException('File not found');
      }
    } else {
      // The simulator did not give a file id
      throw new NotFoundException(`No SimulationRun with id ${id} found`);
    }
  }

  async deleteAll() {
    const res = await this.simulationRunModel.deleteMany({}).exec();
    if (!res.ok) {
      throw new InternalServerErrorException(
        `There was an error. Deleted ${res.deletedCount} out of ${res.n} documents`
      );
    }
  }

  async delete(id: string) {
    const res = await this.simulationRunModel.findByIdAndDelete(id);
    return res;
  }

  async update(
    id: string,
    run: UpdateSimulationRun
  ): Promise<SimulationRunModelReturnType> {
    const model = await this.simulationRunModel.findById(id);
    if (model) {
      if (
        run.status == SimulationRunStatus.SUCCEEDED ||
        run.status == SimulationRunStatus.FAILED
      ) {
        model.runtime = Date.now() - model.submitted.getTime();
        this.logger.debug(`Set ${id} runtime to ${model.runtime} `);
      }

      if (run.public != undefined && run.public != null) {
        model.public = run.public;
        this.logger.debug(`Set ${id} public to ${model.public} `);
      }

      model.resultsSize = run?.resultsSize || model.resultsSize;
      model.status = run?.status || model.status;
      this.logger.log(`Set ${id} status to ${model.status} `);
      this.logger.debug(`Set ${id} resultsSize to ${model.resultsSize} `);

      return toApi(await model.save());
    } else {
      throw new NotFoundException(`Simulation Run with id ${id} was not found`);
    }
  }
  async getAll(): Promise<SimulationRunModelReturnType[]> {
    const res = await this.simulationRunModel
      .find()
      .lean()
      .map((sims) => {
        return sims.map((sim) => {
          return toApi({ ...sim, id: sim._id });
        });
      });
    return res;
  }

  async get(id: string): Promise<SimulationRunModelReturnType | null> {
    const run = await this.simulationRunModel.findById(id).lean().exec();
    let res = null;
    if (run) {
      res = toApi({ ...run, id: run._id });
    }
    return res;
  }

  /**
   *
   * @param run A POJO with the fields of the Simulation Run
   * @param file The file object returned by the Mutter library containing the OMEX file
   */
  async createRun(
    run: SimulationRun,
    file: any
  ): Promise<SimulationRunModelReturnType> {
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
    newSimulationRun.projectSize = newFile.size;
    newSimulationRun.depopulate('file');

    const filePromise = newFile.save();
    const modelPromise = newSimulationRun.save();

    /* Determine if there is a better way to do this. Need to ensure that file is saved properly, if not delete the model entry
    Unclear if I should use a promise.all here. Since promise is created before await, this should be efficient either way.
    The method will probably? still return even if the new run is removed. That would need to be fixed to retun an error instead */

    filePromise.catch((reason) => {
      newSimulationRun.remove();
      throw new InternalServerErrorException('Could not save the file');
    });

    const modelRes = await modelPromise;
    //Wait for this to resolve to make sure that the model is deleted if needed.
    const fileRes = await filePromise;
    return toApi(modelRes);
  }
  constructor(
    @InjectModel(SimulationFile.name) private fileModel: Model<SimulationFile>,
    @InjectModel(SimulationRunModel.name)
    private simulationRunModel: Model<SimulationRunModel>
  ) { }
}
