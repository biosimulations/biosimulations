/**
 * @file Provides methods that imnplement the CRUD operations on the simulation runs in the mongo database. Is used by the controller to excute the user requests from the HTTP API.
 * @author Bilal Shaikh
 * @copyright Biosimulations Team, 2020
 * @license MIT
 */
import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  Inject,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  PayloadTooLargeException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { SimulationFile } from './file.model';
import { Model, mongo } from 'mongoose';
import {
  SimulationRunModel,
  SimulationRunModelReturnType,
  SimulationRunModelType,
  SimulationRunField,
} from './simulation-run.model';
import {
  UpdateSimulationRun,
  UploadSimulationRun,
  UploadSimulationRunUrl,
} from '@biosimulations/datamodel/api';
import { SimulationRunStatus, ISimulator } from '@biosimulations/datamodel/common';
import { SimulationStorageService } from '@biosimulations/shared/storage';
import {
  DispatchFailedPayload,
  DispatchMessage,
  DispatchProcessedPayload,
} from '@biosimulations/messages/messages';
import { ClientProxy } from '@nestjs/microservices';
import { BiosimulationsException } from '@biosimulations/shared/exceptions';
import { Readable } from 'stream';
import { firstValueFrom } from 'rxjs';
import { DeleteResult } from 'mongodb';
import { Endpoints } from '@biosimulations/config/common';

// 1gb in bytes to be used as file size limits
const ONE_GIGABYTE = 1000000000;
const toApi = <T extends SimulationRunModelType>(
  obj: T,
): SimulationRunModelReturnType => {
  delete obj.__v;
  delete obj._id;
  return obj as unknown as SimulationRunModelReturnType;
};

@Injectable()
export class SimulationRunService {
  private endpoints = new Endpoints();
  private logger = new Logger(SimulationRunService.name);

  public constructor(
    @InjectModel(SimulationFile.name) private fileModel: Model<SimulationFile>,
    @InjectModel(SimulationRunModel.name)
    private simulationRunModel: Model<SimulationRunModel>,
    private simulationStorageService: SimulationStorageService,
    private http: HttpService,
    @Inject('NATS_CLIENT') private client: ClientProxy,
  ) {}

  public async setStatus(
    id: string,
    status: SimulationRunStatus,
    statusReason: string,
  ): Promise<SimulationRunModel | null> {
    const model = await this.getModel(id);
    return this.updateModelStatus(model, status, statusReason);
  }

  /**
   * Download the COMBINE/OMEX archive file for the provided id. The COMBINE/OMEX archive file is a ref on the object
   * @param id The id of the simulation
   *
   */
  public async download(id: string): Promise<{
    size?: number;
    originalname?: string;
    mimetype?: string;
    encoding?: string;
    url?: string;
  }> {
    // Find the simulation with the id
    const run = await this.simulationRunModel.findById(id, { file: 1 }).exec();

    //Get the id of the file
    const fileId = run?.file as unknown as string;

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
        return {
          size: SimFile.size,
          mimetype: SimFile.mimetype,
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
    const res: DeleteResult = await this.simulationRunModel
      .deleteMany({})
      .exec();
    if (!res.acknowledged) {
      throw new InternalServerErrorException(
        `There was an error. Unable to delete all documents`,
      );
    }
  }

  public async delete(
    id: string,
  ): Promise<SimulationRunModelReturnType | null> {
    const res = await this.simulationRunModel.findByIdAndDelete(id);
    if (res) {
      return toApi(res);
    } else {
      return res;
    }
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
    this.updateModelStatus(model, run.status, run.statusReason);

    return toApi(await model.save());
  }

  public async getAll(fields: string[] = []): Promise<SimulationRunField[]> {
    const projection: { [key: string]: number } = {
      id: 1,
      _id: 0,
    };

    for (const field of fields) {
      projection[field] = 1;
    }

    const res = await this.simulationRunModel.find({}, projection).lean();

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

  public async createRunWithFile(
    run: UploadSimulationRun,
    file: Express.Multer.File,
  ): Promise<SimulationRunModelReturnType> {
    const simId = String(new mongo.ObjectId());

    try {
      const s3file =
        await this.simulationStorageService.uploadSimulationArchive(
          simId,
          file,
        );
      await this.simulationStorageService.extractSimulationArchive(s3file.Key);
      const url = encodeURI(s3file.Location);

      const fileParsed = {
        originalname: file.originalname,
        encoding: file.encoding,
        mimetype: file.mimetype,
        url: url,
        size: file.size,
      };

      const newFile = new this.fileModel(fileParsed);

      return this.createRun(run, newFile, simId);
    } catch (err) {
      const message = err?.message || 'Error Uploading File';
      throw new BiosimulationsException(
        500,
        message,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        { err: err },
      );
    }
  }

  public async createRunWithURL(
    body: UploadSimulationRunUrl,
  ): Promise<SimulationRunModelReturnType> {
    const url = body.url;
    // If the url provides the following information, grab it and store it in the database
    //! This does not address the security issues of downloading user provided urls.
    //! The content size may not be present or accurate. The backend must check the size. See #2536
    let size = undefined;
    let mimetype = undefined;
    let originalname = undefined;
    let encoding = undefined;

    this.logger.debug(`Downloading file from ${url}`);
    const file = await firstValueFrom(
      this.http.get(url, {
        responseType: 'arraybuffer',
      }),
    );

    if (file) {
      const file_headers = file?.headers;
      size = file_headers['content-length'];
      mimetype = file_headers['content-type'];
      originalname = file_headers['content-disposition']?.split('filename=')[1];
      encoding = file_headers['content-transfer-encoding'];
      if (size && size > ONE_GIGABYTE) {
        throw new PayloadTooLargeException(
          'The maximum allowed size of the file is 1GB. The provided file was ' +
            String(size),
        );
      }
      const fileObj: Express.Multer.File = {
        buffer: file.data,
        originalname,
        mimetype,
        size,
        encoding,
        // Fields below are just to satisfy the interface and are not used
        fieldname: 'file',
        filename: originalname,
        stream: Readable.from(file.data),
        destination: '',
        path: '',
      };

      this.logger.debug(`Downloaded file from ${url}`);
      return this.createRunWithFile(body, fileObj);
    } else {
      throw new Error('Unable to proccess file');
    }
  }
  /**
   *
   * @param run A POJO with the fields of the simulation run
   * @param file The file object returned by the Mutter library containing the COMBINE/OMEX archive file
   */
  private async createRun(
    run: UploadSimulationRun,
    file: SimulationFile,
    id: string,
  ): Promise<SimulationRunModelReturnType> {
    const newSimulationRun = new this.simulationRunModel(run);

    const url = this.endpoints.getSimulatorsEndpoint(run.simulator, run.simulatorVersion);
    const simulatorResponse = await firstValueFrom(this.http.get<ISimulator | null>(url));
    if (simulatorResponse && simulatorResponse.data && simulatorResponse.data.image) {
      newSimulationRun.simulatorVersion = simulatorResponse.data.version;
      newSimulationRun.simulatorDigest = simulatorResponse.data.image.digest;
    } else {
      throw new BadRequestException(`No image for ${run.simulator}:{run.simulatorDigest} is registered with BioSimulators.`);
    }

    const session = await this.simulationRunModel.startSession();
    // If any of the code within the transaction fails, then mongo will abort and revert any changes
    // We dont need to worry about any error handling since any thrown errors will be caught by the app level error handlers
    await session.withTransaction(async (session) => {
      newSimulationRun.$session(session);
      file.$session(session);
      newSimulationRun._id = new mongo.ObjectID(id);
      newSimulationRun.id = String(newSimulationRun._id);
      newSimulationRun.file = file;
      newSimulationRun.projectSize = file.size;
      newSimulationRun.depopulate('file');
      await file.save({ session: session });
      await newSimulationRun.save({ session: session });
    });
    session.endSession();
    return toApi(newSimulationRun);
  }

  private updateModelRunTime(model: SimulationRunModel): SimulationRunModel {
    model.runtime = Date.now() - model.submitted.getTime();
    this.logger.debug(`Set ${model.id} runtime to ${model.runtime} `);
    return model;
  }

  private updateModelStatus(
    model: SimulationRunModel | null,
    status: SimulationRunStatus | undefined,
    statusReason: string | undefined,
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
      model.statusReason = statusReason;
      model.refreshCount = model.refreshCount + 1;
      this.logger.log(
        `Set ${model.id} status to ${model.status} on update ${model.refreshCount} `,
      );
      this.updateModelRunTime(model);
      if (status == SimulationRunStatus.FAILED) {
        const message = new DispatchFailedPayload(model.id);
        this.client.emit(DispatchMessage.failed, message);
      } else if (status == SimulationRunStatus.SUCCEEDED) {
        const message = new DispatchProcessedPayload(model.id);
        this.client.emit(DispatchMessage.processed, message);
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

  // TODO Use this method to publish simulation runs.
  // Add validation to check that the simulation run is in the correct state
  // Check that the logs, results, metadata, specs are present and valid
  // Determine how to incorporate unique id.
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
