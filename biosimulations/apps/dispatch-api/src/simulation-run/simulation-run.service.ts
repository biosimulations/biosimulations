/**
 * @file Provides methods that imnplement the CRUD operations on the simulation runs in the mongo database. Is used by the controller to excute the user requests from the HTTP API.
 * @author Bilal Shaikh
 * @copyright Biosimulations Team, 2020
 * @license MIT
 */
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { SimulationFile } from './file.model';
import { Model } from 'mongoose';
import {
  SimulationRunModel,
  SimulationRunModelReturnType,
  SimulationRunModelType,
} from './simulation-run.model';
import {
  UpdateSimulationRun,
  UploadSimulationRun,
  UploadSimulationRunUrl,
} from '@biosimulations/dispatch/api-models';
import { SimulationRunStatus } from '@biosimulations/datamodel/common';
import { SharedStorageService } from '@biosimulations/shared/storage';

const toApi = <T extends SimulationRunModelType>(
  obj: T,
): SimulationRunModelReturnType => {
  delete obj.__v;
  delete obj._id;
  return (obj as unknown) as SimulationRunModelReturnType;
};

@Injectable()
export class SimulationRunService {
  private logger = new Logger(SimulationRunService.name);

  public constructor(
    @InjectModel(SimulationFile.name) private fileModel: Model<SimulationFile>,
    @InjectModel(SimulationRunModel.name)
    private simulationRunModel: Model<SimulationRunModel>,
    private storageService: SharedStorageService,
  ) {}

  public async setStatus(
    id: string,
    status: SimulationRunStatus,
  ): Promise<SimulationRunModel | null> {
    const model = await this.getModel(id);
    return this.updateModelStatus(model, status);
  }

  /**
   * Download the COMBINE/OMEX archive file for the provided id. The COMBINE/OMEX archive file is a ref on the object
   * @param id The id of the simulation
   *
   */
  public async download(
    id: string,
  ): Promise<{
    size?: number;
    buffer?: Buffer;
    originalname?: string;
    mimetype?: string;
    encoding?: string;
    url?: string;
  }> {
    // Find the simulation with the id
    const file = await this.simulationRunModel.findById(id, { file: 1 }).exec();

    //Get the id of the file
    const fileId = (file?.file as unknown) as string;

    if (fileId) {
      // Get the file object from the db
      const SimFile = await this.fileModel
        .findOne(
          { _id: fileId },
          {
            size: 1,
            mimetype: 1,
            buffer: 1,
            originalname: 1,
            encoding: 1,
            url: 1,
          },
        )
        .exec();
      if (SimFile) {
        // Return the file and metadata
        const buffer = SimFile?.buffer?.buffer
          ? Buffer.from(SimFile.buffer.buffer)
          : undefined;
        return {
          size: SimFile.size,
          mimetype: SimFile.mimetype,
          buffer: buffer,
          encoding: SimFile.encoding,
          originalname: SimFile.originalname,
          url: SimFile.url,
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

  public async deleteAll(): Promise<void> {
    const res = await this.simulationRunModel.deleteMany({}).exec();
    if (!res.ok) {
      throw new InternalServerErrorException(
        `There was an error. Deleted ${res.deletedCount} out of ${res.n} documents`,
      );
    }
  }

  public async delete(id: string): Promise<SimulationRunModel | null> {
    const res = await this.simulationRunModel.findByIdAndDelete(id);
    return res;
  }

  public async update(
    id: string,
    run: UpdateSimulationRun,
  ): Promise<SimulationRunModelReturnType> {
    const model = await this.getModel(id);

    if (!model) {
      throw new NotFoundException(`Simulation run with id ${id} was not found`);
    }

    this.updateModelPublic(model, run.public);
    this.updateModelResultSize(model, run.resultsSize);
    this.updateModelStatus(model, run.status);

    return toApi(await model.save());
  }

  public async getAll(): Promise<SimulationRunModelReturnType[]> {
    const res = await this.simulationRunModel
      .find()
      .lean()
      .map((sims) => {
        // This assertion is true unless only one simulation run is in the database
        const data = (sims as unknown) as SimulationRunModel[];
        return data.map((sim) => {
          return toApi({ ...sim, id: sim._id });
        });
      });
    return res;
  }

  public async get(id: string): Promise<SimulationRunModelReturnType | null> {
    const run = await this.simulationRunModel
      .findById(id)
      .lean()
      .exec()
      .catch((err) => {
        if (err.name == 'CastError') {
          throw new NotFoundException();
        }
      });

    let res = null;
    if (run) {
      res = toApi({ ...run, id: run._id });
    }
    return res;
  }

  public async createRunWithURL(
    body: UploadSimulationRunUrl,
  ): Promise<SimulationRunModelReturnType> {
    const url = body.url;
    const file = new this.fileModel({ url });
    return this.createRun(body, file);
  }
  /**
   *
   * @param run A POJO with the fields of the simulation run
   * @param file The file object returned by the Mutter library containing the COMBINE/OMEX archive file
   */

  private async createRun(
    run: UploadSimulationRun,
    file: SimulationFile,
  ): Promise<SimulationRunModelReturnType> {
    const newSimulationRun = new this.simulationRunModel(run);
    newSimulationRun.id = newSimulationRun._id;
    newSimulationRun.file = file;
    newSimulationRun.projectSize = file.size;
    newSimulationRun.depopulate('file');

    if (file.buffer) {
      this.logger.log('correct branch');
      const name = file.originalname || 'input.omex';
      const fileId = newSimulationRun.id + '/' + name;
      this.storageService
        .putObject(fileId, file.buffer)
        .then((value) => console.log('test'))
        .catch((err) => this.logger.error(err));
    }

    const modelPromise = newSimulationRun.save();

    /* Determine if there is a better way to do this. Need to ensure that file is saved properly, if not delete the model entry
    Unclear if I should use a promise.all here. Since promise is created before await, this should be efficient either way.
    The method will probably? still return even if the new run is removed. That would need to be fixed to retun an error instead */
    // yes, use transactions.

    const modelRes = await modelPromise;
    //Wait for this to resolve to make sure that the model is deleted if needed.
    try {
      await file.save();
    } catch (error) {
      newSimulationRun.remove();
      throw error;
    }
    return toApi(modelRes);
  }
  public async createRunWithFile(
    run: UploadSimulationRun,
    file: any,
  ): Promise<SimulationRunModelReturnType> {
    const fileParsed = {
      originalname: file.originalname,
      encoding: file.encoding,
      mimetype: file.mimetype,
      buffer: file.buffer,
      size: file.size,
    };

    const newFile = new this.fileModel(fileParsed);
    return this.createRun(run, newFile);
  }
  private updateModelRunTime(model: SimulationRunModel): SimulationRunModel {
    model.runtime = Date.now() - model.submitted.getTime();
    this.logger.debug(`Set ${model.id} runtime to ${model.runtime} `);
    return model;
  }

  private updateModelStatus(
    model: SimulationRunModel | null,
    status: SimulationRunStatus | undefined,
  ): SimulationRunModel | null {
    let allowUpdate = true;

    if (!model) {
      allowUpdate = false;
    } else if (
      model.status == SimulationRunStatus.SUCCEEDED ||
      model.status == SimulationRunStatus.FAILED ||
      !status
    ) {
      // succeeded and failed should not be updated
      allowUpdate = false;
    } else if (model.status == SimulationRunStatus.PROCESSING) {
      // processing should not go back to created, queued or running
      allowUpdate = ![
        SimulationRunStatus.CREATED,
        SimulationRunStatus.QUEUED,
        SimulationRunStatus.RUNNING,
      ].includes(status);
    } else if (model.status == SimulationRunStatus.RUNNING) {
      // running should not go back to created or queued
      allowUpdate = ![
        SimulationRunStatus.CREATED,
        SimulationRunStatus.QUEUED,
      ].includes(status);
    }

    // Careful not to add else here
    if (model && status && allowUpdate) {
      model.status = status;
      model.refreshCount = model.refreshCount + 1;
      this.logger.log(
        `Set ${model.id} status to ${model.status} on update ${model.refreshCount} `,
      );
      if (
        status == SimulationRunStatus.SUCCEEDED ||
        status == SimulationRunStatus.FAILED
      ) {
        this.updateModelRunTime(model);
      }
    }
    return model;
  }

  private updateModelResultSize(
    model: SimulationRunModel,
    resultsSize: number | undefined,
  ): SimulationRunModel {
    if (resultsSize) {
      model.resultsSize = resultsSize;
      this.logger.debug(`Set ${model.id} resultsSize to ${model.resultsSize} `);
    }
    return model;
  }

  private updateModelPublic(
    model: SimulationRunModel,
    isPublic: boolean | undefined | null,
  ): SimulationRunModel {
    if (isPublic != undefined && isPublic != null) {
      model.public = isPublic;
      this.logger.debug(`Set ${model.id} public to ${model.public} `);
    }
    return model;
  }

  private async getModel(id: string): Promise<SimulationRunModel | null> {
    return this.simulationRunModel.findById(id).catch((_) => null);
  }
}
