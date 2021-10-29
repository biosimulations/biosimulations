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
  CACHE_MANAGER,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { SimulationFile } from './file.model';
import { Model, mongo } from 'mongoose';
import {
  SimulationRunModel,
  SimulationRunModelReturnType,
  SimulationRunModelType,
} from './simulation-run.model';
import {
  UpdateSimulationRun,
  UploadSimulationRun,
  UploadSimulationRunUrl,
  SimulationRunSummary,
  SimulationRunTaskSummary,
  SimulationRunOutputSummary,
  ArchiveMetadata,
} from '@biosimulations/datamodel/api';
import {
  SimulationRunStatus,
  ISimulator,
  SimulationRunLogStatus,
  SimulationTypeName,
  SimulationRunOutputTypeName,
  ModelFormat,
  MODEL_FORMATS,
  VEGA_FORMAT,
  Ontologies,
} from '@biosimulations/datamodel/common';
import { SimulationStorageService } from '@biosimulations/shared/storage';
import {
  DispatchFailedPayload,
  DispatchMessage,
  DispatchProcessedPayload,
} from '@biosimulations/messages/messages';
import { ClientProxy } from '@nestjs/microservices';
import { BiosimulationsException } from '@biosimulations/shared/exceptions';
import { Readable } from 'stream';
import { firstValueFrom, Observable, of, map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DeleteResult } from 'mongodb';
import { Endpoints } from '@biosimulations/config/common';
import { urls } from '@biosimulations/config/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FilesService } from '../files/files.service';
import { SpecificationsService } from '../specifications/specifications.service';
import { ResultsService } from '../results/results.service';
import { LogsService } from '../logs/logs.service';
import { MetadataService } from '../metadata/metadata.service';
import { ConfigService } from '@nestjs/config';
import { FileModel } from '../files/files.model';
import {
  SpecificationsModel,
  SedTask,
  SedReport,
  SedPlot2D,
  SedPlot3D,
  SedDataSet,
  SedCurve,
  SedSurface,
} from '../specifications/specifications.model';
import { Results, Output, OutputData } from '../results/datamodel';
import { CombineArchiveLog } from '../logs/logs.model';
import {
  SimulationRunMetadataIdModel,
  MetadataModel,
} from '../metadata/metadata.model';
import { OntologiesService } from '@biosimulations/ontology/ontologies';
import { Cache } from 'cache-manager';

// 1gb in bytes to be used as file size limits
const ONE_GIGABYTE = 1000000000;
const toApi = <T extends SimulationRunModelType>(
  obj: T,
): SimulationRunModelReturnType => {
  delete obj.__v;
  delete obj._id;
  return obj as unknown as SimulationRunModelReturnType;
};

type CheckResult =
  | FileModel[]
  | SpecificationsModel[]
  | Results
  | CombineArchiveLog
  | SimulationRunMetadataIdModel
  | null;

interface Check {
  check: Promise<CheckResult>;
  errorMessage: string;
  isValid: (result: any) => boolean;
}

@Injectable()
export class SimulationRunService {
  private endpoints: Endpoints;
  private logger = new Logger(SimulationRunService.name);

  public constructor(
    @InjectModel(SimulationFile.name) private fileModel: Model<SimulationFile>,
    @InjectModel(SimulationRunModel.name)
    private simulationRunModel: Model<SimulationRunModel>,
    private simulationStorageService: SimulationStorageService,
    private http: HttpService,
    @Inject('NATS_CLIENT') private client: ClientProxy,
    private filesService: FilesService,
    private specificationsService: SpecificationsService,
    private resultsService: ResultsService,
    private logsService: LogsService,
    private metadataService: MetadataService,
    private ontologiesService: OntologiesService,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    const env = this.configService.get('server.env');
    this.endpoints = new Endpoints(env);
  }

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
    const run = await this.simulationRunModel
      .findOne({ id }, { file: 1 })
      .exec();

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

    const count = await this.simulationRunModel.count();
    if (count !== 56) {
      throw new InternalServerErrorException(
        'Some simulation runs could not be deleted',
      );
    }
  }

  public async delete(
    id: string,
  ): Promise<SimulationRunModelReturnType | null> {
    const res = await this.simulationRunModel.findOneAndDelete({ id });
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

    this.updateModelResultSize(model, run.resultsSize);
    this.updateModelStatus(model, run.status, run.statusReason);

    return toApi(await model.save());
  }

  public async getAll(): Promise<SimulationRunModelReturnType[]> {
    const runs = await this.simulationRunModel.find({}).exec();
    return runs.map((run) => toApi({ ...run, id: run._id }));
  }

  public async get(id: string): Promise<SimulationRunModelReturnType | null> {
    const run = await this.simulationRunModel.findOne({ id }).lean().exec();

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
    let size = 0;
    let mimetype;
    let originalname;
    let encoding;

    this.logger.debug(`Downloading file from ${url}`);
    const file = await firstValueFrom(
      this.http.get(url, {
        responseType: 'arraybuffer',
      }),
    );

    if (file) {
      const file_headers = file?.headers;
      try {
        size = Number(file_headers['content-length']);
      } catch (err) {
        size = 0;
        this.logger.warn(err);
      }
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
      throw new Error('Unable to process file');
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
    const simulator = await this.getSimulator(
      run.simulator,
      run.simulatorVersion,
    );

    if (simulator && simulator.image) {
      newSimulationRun.simulatorVersion = simulator.version;
      newSimulationRun.simulatorDigest = simulator.image.digest;
    } else if (simulator === null) {
      throw new BadRequestException(
        `No image for ${run.simulator}:${run.simulatorVersion} is registered with BioSimulators.`,
      );
    } else {
      throw new InternalServerErrorException(
        `An error occurred in retrieving ${run.simulator}:${run.simulatorVersion}.`,
      );
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

  private getSimulator(
    simulator: string,
    simulatorVersion = 'latest',
  ): Promise<ISimulator | null | false> {
    if (simulatorVersion === 'latest') {
      const url = this.endpoints.getLatestSimulatorsEndpoint(simulator);

      return firstValueFrom(
        this.http.get<ISimulator[]>(url).pipe(
          catchError((error: HttpErrorResponse): Observable<null | false> => {
            this.logger.error(error.message);
            if (error.status === 404) {
              return of(null);
            } else {
              return of(false);
            }
          }),
          map((response): ISimulator | null | false => {
            if (response === null || response === false) {
              return response;
            } else {
              return response.data[0];
            }
          }),
        ),
      );
    } else {
      const url = this.endpoints.getSimulatorsEndpoint(
        simulator,
        simulatorVersion,
      );

      return firstValueFrom(
        this.http.get<ISimulator>(url).pipe(
          catchError((error: HttpErrorResponse): Observable<null | false> => {
            this.logger.error(error.message);
            if (error.status === 404) {
              return of(null);
            } else {
              return of(false);
            }
          }),
          map((response): ISimulator | null | false => {
            if (response === null || response === false) {
              return response;
            } else {
              return response.data;
            }
          }),
        ),
      );
    }
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

  private async getModel(id: string): Promise<SimulationRunModel | null> {
    return this.simulationRunModel.findById(id).catch((_) => null);
  }

  public async getRunSummaries(raiseErrors = false): Promise<SimulationRunSummary[]> {
    const runs = await this.simulationRunModel.find({}).select('id status').exec();
    return (await Promise.allSettled(
      runs.map((run) => {
        return this.getRunSummary(run.id, raiseErrors);
      })
    ))
    .map((settledResult, iRun: number) => {
      if (settledResult.status !== 'fulfilled' || !('value' in settledResult)) {
        console.log('A summary of run \'${runs[iRun].id}\' could not be retrieved.');
        throw new InternalServerErrorException('One or more summaries could not be retrieved.');
      }
      return settledResult.value;
    });
  }

  public async getRunSummary(id: string, raiseErrors = false): Promise<SimulationRunSummary> {
    const cacheKey = `SimulationRun:summary:${raiseErrors}:${id}`;
    const cachedValue = await this.cacheManager.get(cacheKey) as (SimulationRunSummary | null);
    if (cachedValue) {
      return cachedValue;
    } else {
      const value = await this._getRunSummary(id);
      if (value.run.status === SimulationRunStatus.SUCCEEDED || SimulationRunStatus.FAILED) {
        await this.cacheManager.set(cacheKey, value, { ttl: 0 });
      }
      return value;
    }
  }

  private async _getRunSummary(id: string, raiseErrors = false): Promise<SimulationRunSummary> {
    /* get data */
    const settledResults = await Promise.allSettled([
        this.get(id),
        this.filesService.getSimulationFiles(id),
        this.specificationsService.getSpecificationsBySimulation(id),
        this.logsService.getLog(id),
        this.metadataService.getMetadata(id),
      ]);

    const runSettledResult: PromiseSettledResult<SimulationRunModelReturnType | null> = settledResults[0];
    const filesResult: PromiseSettledResult<FileModel[]> = settledResults[1];
    const simulationExptsResult: PromiseSettledResult<SpecificationsModel[]> = settledResults[2];
    const logResult: PromiseSettledResult<CombineArchiveLog> = settledResults[3];
    const rawMetadataResult: PromiseSettledResult<SimulationRunMetadataIdModel | null> = settledResults[4];

    if (runSettledResult.status !== 'fulfilled' || !('value' in runSettledResult) || !runSettledResult.value) {
      throw new NotFoundException(`No run could be found with id '${id}'`);
    }

    /* initialize summary with run information */
    const rawRun = runSettledResult.value as SimulationRunModelReturnType;

    const simulator = await this.getSimulator(rawRun.simulator);
    if (!simulator) {
      throw new NotFoundException(`Simulator '${rawRun.simulator}' for run could be found`);
    }

    const summary: SimulationRunSummary = {
      id: rawRun.id,
      name: rawRun.name,
      tasks: undefined,
      outputs: undefined,
      run: {
        simulator: {
          id: rawRun.simulator,
          name: simulator.name,
          version: rawRun.simulatorVersion,
          digest: rawRun.simulatorDigest,
          url: `${urls.simulators}/simulators/${rawRun.simulator}`,
        },
        cpus: rawRun.cpus,
        memory: rawRun.memory,
        maxTime: rawRun.maxTime,
        envVars: rawRun.envVars,
        status: rawRun.status,
        runtime: rawRun.runtime,
        projectSize: rawRun.projectSize,
        resultsSize: rawRun.resultsSize,
      },
      metadata: undefined,
      submitted: rawRun.submitted.toString(),
      updated: rawRun.updated.toString(),
    };

    /* get summary of the simulation experiment */
    if (
      filesResult.status === 'fulfilled'
      && !!filesResult.value
      && simulationExptsResult.status === 'fulfilled'
      && !!simulationExptsResult.value
      && logResult.status === 'fulfilled'
      && !!logResult.value
    ) {
      const files = filesResult.value;
      const simulationExpts = simulationExptsResult.value;
      const log = logResult.value;

      const tasks: SimulationRunTaskSummary[] = [];
      const outputs: SimulationRunOutputSummary[] = [];

      const taskAlgorithmMap: { [uri: string]: string | undefined } = {};

      const summaryTasks: SimulationRunTaskSummary[] = [];
      const summaryOutputs: SimulationRunOutputSummary[] = [];
      summary.tasks = summaryTasks;
      summary.outputs = summaryOutputs;

      if (log.duration !== null) {
        summary.run.runtime = log.duration;
      }

      log?.sedDocuments?.forEach((sedDocument): void => {
        const location = sedDocument.location.startsWith('./')
          ? sedDocument.location.substring(2)
          : sedDocument.location;
        sedDocument?.tasks?.forEach((task): void => {
          const uri = location + '/' + task.id;
          taskAlgorithmMap[uri] = task?.algorithm || undefined;
        });
      });

      simulationExpts.forEach((simulationExpt: SpecificationsModel): void => {
        const docLocation = simulationExpt.id.startsWith('./')
          ? simulationExpt.id.substring(2)
          : simulationExpt.id;

        simulationExpt.tasks.forEach((task: SedTask): void => {
          const uri = docLocation + '/' + task.simulation.id;

          let modelFormat: ModelFormat | null = null;
          for (const format of MODEL_FORMATS) {
            if (task.model.language.startsWith(format.sedUrn)) {
              modelFormat = format;
              break;
            }
          }

          const algorithmKisaoId =
            taskAlgorithmMap[uri] || task.simulation.algorithm.kisaoId;
          const algorithmKisaoTerm = this.ontologiesService.getTerm(
            Ontologies.KISAO,
            algorithmKisaoId,
          );

          summaryTasks.push({
            uri: docLocation + '/' + task.id,
            id: task.id,
            name: task?.name,
            model: {
              uri: docLocation + '/' + task.model.id,
              id: task.model.id,
              name: task.model?.name,
              source: task.model.source,
              language: {
                name: modelFormat?.name || undefined,
                acronym: modelFormat?.acronym || undefined,
                sedmlUrn: task.model.language,
                edamId: modelFormat?.edamId || undefined,
                url: modelFormat?.url || undefined,
              },
            },
            simulation: {
              type: {
                id: task.simulation._type,
                name: SimulationTypeName[task.simulation._type],
                url: 'http://sed-ml.org/',
              },
              uri: uri,
              id: task.simulation.id,
              name: task.simulation?.name,
              algorithm: {
                kisaoId: algorithmKisaoId,
                name: algorithmKisaoTerm?.name || undefined,
                url: algorithmKisaoTerm?.url || undefined,
              },
            },
          });
        });

        simulationExpt.outputs.forEach(
          (output: SedReport | SedPlot2D | SedPlot3D): void => {
            summaryOutputs.push({
              type: {
                id: output._type,
                name: SimulationRunOutputTypeName[output._type],
                url: 'http://sed-ml.org/',
              },
              uri: docLocation + '/' + output.id,
              name: output?.name,
            });
          },
        );
      });

      files.forEach((file: FileModel): void => {
        if (VEGA_FORMAT.combineUris.includes(file.format)) {
          summaryOutputs.push({
            type: {
              id: 'Vega',
              name: SimulationRunOutputTypeName.Vega,
              url: 'https://vega.github.io/vega/',
            },
            uri: file.location.startsWith('./')
              ? file.location.substring(2)
              : file.location,
            name: undefined,
          });
        }
      });
    } else if (raiseErrors) {
      throw new InternalServerErrorException('Information about the files, simulation experiments, or log could not be retrieved')
    }

    /* get top-level metadata for the project */
    if (rawMetadataResult.status === 'fulfilled' && !!rawMetadataResult.value) {
      const rawMetadata = rawMetadataResult.value;

      let rawMetadatum!: ArchiveMetadata;
      for (rawMetadatum of rawMetadata.metadata) {
        if (rawMetadatum.uri.search('/') === -1) {
          break;
        }
      }

      summary.metadata = {
        title: rawMetadatum?.title,
        abstract: rawMetadatum?.abstract,
        description: rawMetadatum?.description,
        thumbnails: rawMetadatum.thumbnails,
        sources: rawMetadatum.sources,
        keywords: rawMetadatum.keywords,
        taxa: rawMetadatum.taxa,
        encodes: rawMetadatum.encodes,
        predecessors: rawMetadatum.predecessors,
        successors: rawMetadatum.successors,
        seeAlso: rawMetadatum.seeAlso,
        identifiers: rawMetadatum.identifiers,
        citations: rawMetadatum.citations,
        creators: rawMetadatum.creators,
        contributors: rawMetadatum.contributors,
        license: rawMetadatum?.license,
        funders: rawMetadatum.funders,
        other: rawMetadatum.other,
        created: rawMetadatum.created,
        modified: rawMetadatum.modified?.[0] || undefined,
      };
    } else if (raiseErrors) {
      throw new InternalServerErrorException('Information about the files, simulation experiments, or log could not be retrieved')
    }

    /* return summary */
    return summary;
  }

  /** Check that a simulation run is valid
   *
   * * Run: was successful (`SUCCEEDED` state)
   * * Files: valid and accessible
   * * Simulation specifications: valid and accessible
   * * Results: valid and accessible
   * * Logs: valid and accessible
   * * Metatadata: valid and meets minimum requirements
   *
   * @param id id of the simulation run
   * @param validateSimulationResultsData whether to validate the data for each SED-ML report and plot of each SED-ML document
   */
  public async validateRun(
    id: string,
    validateSimulationResultsData = false,
  ): Promise<void> {
    let run!: SimulationRunModelReturnType | null;
    try {
      run = await this.get(id);
    } catch {
      throw new BiosimulationsException(
        400,
        'Simulation run is not valid for publication.',
        `${id} is not a valid id for a simulation run. Only successful simulation runs can be published.`,
      );
    }

    if (!run) {
      throw new BiosimulationsException(
        400,
        'Simulation run is not valid for publication.',
        `A simulation run with id ${id} could not be found. Only successful simulation runs can be published.`,
      );
    }

    const errors: string[] = [];

    /**
     * Check run
     */

    if (run.status !== SimulationRunStatus.SUCCEEDED) {
      errors.push(
        `The run did not succeed. The status of the run is '${run.status}'. Only successful simulation runs can be published.`,
      );
    }

    if (!run.projectSize) {
      errors.push(
        `The COMBINE archive for the run appears to be empty. An error may have occurred in saving the archive. Archives must be properly saved for publication. If you believe this is incorrect, please submit an issue at https://github.com/biosimulations/biosimulations/issues/new/choose.`,
      );
    }

    if (!run.resultsSize) {
      errors.push(
        `The results for run appear to be empty. An error may have occurred in saving the results. Results must be properly saved for publication. If you believe this is incorrect, please submit an issue at https://github.com/biosimulations/biosimulations/issues/new/choose.`,
      );
    }

    if (errors.length) {
      throw new BiosimulationsException(
        400,
        'Simulation run is not valid for publication.',
        errors.join('\n\n'),
      );
    }

    /**
     * Check files, SED-ML, results, logs, metadata
     */

    const checks: Check[] = [
      {
        check: this.filesService.getSimulationFiles(id),
        errorMessage: `Files (contents of COMBINE archive) could not be found for simulation run ${id}.`,
        isValid: (files: FileModel[]): boolean => files.length > 0,
      },
      {
        check: this.specificationsService.getSpecificationsBySimulation(id),
        errorMessage: `Simulation specifications (SED-ML documents) could not be found for simulation run ${id}. For publication, simulation experiments must be valid SED-ML documents. Please check that the SED-ML documents in the COMBINE archive are valid. More information is available at https://biosimulators.org/conventions/simulation-experiments and https://run.biosimulations.org/utils/validate-project.`,
        isValid: (specifications: SpecificationsModel[]): boolean =>
          specifications.length > 0,
      },
      {
        check: this.resultsService.getResults(
          id,
          validateSimulationResultsData,
        ),
        errorMessage: `Simulation results could not be found for run ${id}. For publication, simulation runs produce at least one SED-ML report or plot.`,
        isValid: (results: Results): boolean => results?.outputs?.length > 0,
      },
      {
        check: this.logsService.getLog(id) as Promise<CombineArchiveLog>,
        errorMessage: `Simulation log could not be found for run ${id}. For publication, simulation runs must have validate logs. More information is available at https://biosimulators.org/conventions/simulation-logs.`,
        isValid: (log: CombineArchiveLog): boolean => {
          return (
            log.status === SimulationRunLogStatus.SUCCEEDED && !!log.output
          );
        },
      },
      {
        check: this.metadataService.getMetadata(id),
        errorMessage: `Metadata could not be found for simulation run ${id}. For publication, simulation runs must meet BioSimulations' minimum metadata requirements. More information is available at https://biosimulators.org/conventions/metadata and https://run.biosimulations.org/utils/validate-project.`,
        isValid: (metadata: SimulationRunMetadataIdModel | null): boolean => {
          if (!metadata) {
            return false;
          }
          const archiveMetadata = metadata.metadata.filter(
            (metadata: MetadataModel): boolean => {
              return metadata.uri.search('/') === -1;
            },
          );
          return archiveMetadata.length === 1;
        },
      },
    ];

    const checkResults: PromiseSettledResult<any>[] = await Promise.allSettled(
      checks.map((check: Check) => check.check),
    );

    const checksAreValid: boolean[] = [];
    for (let iCheck = 0; iCheck < checks.length; iCheck++) {
      const check = checks[iCheck];
      const result = checkResults[iCheck];
      let checkIsValid!: boolean;

      if (result.status !== 'fulfilled') {
        errors.push(check.errorMessage + '\n  ' + result.reason);
      } else if (result.value === undefined) {
        checkIsValid = false;
        errors.push(check.errorMessage);
      } else if (!check.isValid(result.value)) {
        checkIsValid = false;
        errors.push(check.errorMessage);
      } else {
        checkIsValid = true;
      }

      checksAreValid.push(checkIsValid);
    }

    /* check that there are results for all specified SED-ML reports and plots */
    if (
      checkResults[1].status === 'fulfilled' &&
      checkResults[2].status === 'fulfilled' &&
      checksAreValid[1] &&
      checksAreValid[2]
    ) {
      const specs: SpecificationsModel[] = checkResults[1].value;
      const results: Results = checkResults[2].value;

      const expectedDataSetUris = new Set<string>();
      specs.forEach((spec: SpecificationsModel): void => {
        let docLocation = spec.id;
        if (docLocation.startsWith('./')) {
          docLocation = docLocation.substring(2);
        }

        spec.outputs.forEach((output): void => {
          if (output._type === 'SedReport') {
            (output as SedReport).dataSets.forEach(
              (dataSet: SedDataSet): void => {
                expectedDataSetUris.add(
                  'Report DataSet: `' +
                    docLocation +
                    '/' +
                    output.id +
                    '/' +
                    dataSet.id +
                    '`',
                );
              },
            );
          } else if (output._type === 'SedPlot2D') {
            (output as SedPlot2D).curves.forEach((curve: SedCurve): void => {
              expectedDataSetUris.add(
                'Plot DataGenerator: `' +
                  docLocation +
                  '/' +
                  output.id +
                  '/' +
                  curve.xDataGenerator.id +
                  '`',
              );
              expectedDataSetUris.add(
                'Plot DataGenerator: `' +
                  docLocation +
                  '/' +
                  output.id +
                  '/' +
                  curve.yDataGenerator.id +
                  '`',
              );
            });
          } else {
            (output as SedPlot3D).surfaces.forEach(
              (surface: SedSurface): void => {
                expectedDataSetUris.add(
                  'Plot DataGenerator: `' +
                    docLocation +
                    '/' +
                    output.id +
                    '/' +
                    surface.xDataGenerator.id +
                    '`',
                );
                expectedDataSetUris.add(
                  'Plot DataGenerator: `' +
                    docLocation +
                    '/' +
                    output.id +
                    '/' +
                    surface.yDataGenerator.id +
                    '`',
                );
                expectedDataSetUris.add(
                  'Plot DataGenerator: `' +
                    docLocation +
                    '/' +
                    output.id +
                    '/' +
                    surface.zDataGenerator.id +
                    '`',
                );
              },
            );
          }
        });
      });

      const dataSetUris = new Set<string>();
      const unrecordedDatSetUris = new Set<string>();
      results.outputs.forEach((output: Output): void => {
        let docLocationOutputId = output.outputId;
        if (docLocationOutputId.startsWith('./')) {
          docLocationOutputId = docLocationOutputId.substring(2);
        }

        const type =
          output.type === 'SedReport' ? 'Report DataSet' : 'Plot DataGenerator';

        output.data.forEach((data: OutputData): void => {
          const uri = type + ': `' + docLocationOutputId + '/' + data.id + '`';
          dataSetUris.add(uri);
          if (validateSimulationResultsData && !Array.isArray(data.values)) {
            unrecordedDatSetUris.add(uri);
          }
        });
      });

      const unproducedDatSetUris = [...expectedDataSetUris].filter(
        (uri) => !dataSetUris.has(uri),
      );

      if (expectedDataSetUris.size === 0) {
        errors.push(
          'Simulation run does not specify any SED reports or plots. For publication, simulation runs must produce data for at least one SED-ML report or plot.',
        );
      } else if (unproducedDatSetUris.length) {
        unproducedDatSetUris.sort();
        errors.push(
          'One or more data sets of reports or data generators of plots was not recorded. ' +
            'For publication, there must be simulation results for each data set and data ' +
            'generator specified in each SED-ML documents in the COMBINE archive. The ' +
            'following data sets and data generators were not recorded.\n\n  * ' +
            unproducedDatSetUris.join('\n  * '),
        );
      } else if (unrecordedDatSetUris.size) {
        errors.push(
          'Data was not recorded for the following data sets for reports and data generators for plots.\n\n  * ' +
            Array.from(unrecordedDatSetUris).sort().join('\n  * '),
        );
      }
    }

    if (errors.length) {
      throw new BiosimulationsException(
        400,
        'Simulation run is not valid for publication.',
        errors.join('\n\n'),
      );
    }

    /* return if valid */
    return;
  }
}
