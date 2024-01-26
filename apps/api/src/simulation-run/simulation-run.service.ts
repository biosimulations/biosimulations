/**
 * @file Provides methods that implement the CRUD operations on the simulation runs in the mongo database. Is used by the controller to execute the user requests from the HTTP API.
 * @author Bilal Shaikh
 * @copyright BioSimulations Team, 2020
 * @license MIT
 */
import { HttpService } from '@nestjs/axios';
import { retryBackoff } from '@biosimulations/rxjs-backoff';
import {
  Injectable,
  Inject,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  BadRequestException,
  CACHE_MANAGER,
  HttpStatus,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model, mongo } from 'mongoose';
import { SimulationRunModel, SimulationRunModelReturnType, SimulationRunModelType } from './simulation-run.model';
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
  SimulationTypeName,
  SimulationRunOutputTypeName,
  Ontologies,
  EdamTerm,
} from '@biosimulations/datamodel/common';
import { BIOSIMULATIONS_FORMATS } from '@biosimulations/ontology/extra-sources';
import { SimulationStorageService } from '@biosimulations/shared/storage';
import { DispatchFailedPayload, DispatchMessage, DispatchProcessedPayload } from '@biosimulations/messages/messages';
import { ClientProxy } from '@nestjs/microservices';
import { Readable } from 'stream';
import { firstValueFrom, Observable, of, map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Endpoints, AppRoutes } from '@biosimulations/config/common';
import { FilesService } from '../files/files.service';
import { SpecificationsService } from '../specifications/specifications.service';
import { ResultsService } from '../results/results.service';
import { LogsService } from '../logs/logs.service';
import { MetadataService } from '../metadata/metadata.service';
import { ConfigService } from '@nestjs/config';
import { FileModel } from '../files/files.model';
import {
  SpecificationsModel,
  SedModel,
  SedSimulation,
  SedAbstractTask,
  SedTask,
  SedReport,
  SedPlot2D,
  SedPlot3D,
} from '../specifications/specifications.model';
import { CombineArchiveLog } from '@biosimulations/datamodel/common';
import { SimulationRunMetadataIdModel } from '../metadata/metadata.model';
import { OntologyApiService } from '@biosimulations/ontology/api';
import { Cache } from 'cache-manager';
import { AxiosError } from 'axios';
import { ProjectsService } from '../projects/projects.service';
import { BiosimulationsException } from '@biosimulations/shared/exceptions';

const toApi = <T extends SimulationRunModelType>(obj: T): SimulationRunModelReturnType => {
  delete obj.__v;
  delete obj._id;
  return obj as unknown as SimulationRunModelReturnType;
};

interface PromiseResult<T> {
  id?: string;
  succeeded: boolean;
  value?: T;
  error?: AxiosError;
}

@Injectable()
export class SimulationRunService {
  private vegaFormatOmexManifestUris: string[];
  private endpoints: Endpoints;
  private appRoutes: AppRoutes;
  private logger = new Logger(SimulationRunService.name);

  public constructor(
    @InjectModel(SimulationRunModel.name)
    private simulationRunModel: Model<SimulationRunModel>,
    private simulationStorageService: SimulationStorageService,
    private httpService: HttpService,
    @Inject('NATS_CLIENT') private client: ClientProxy,
    private filesService: FilesService,
    private specificationsService: SpecificationsService,
    private resultsService: ResultsService,
    private logsService: LogsService,
    private metadataService: MetadataService,
    private ontologiesService: OntologyApiService,
    @Inject(forwardRef(() => ProjectsService))
    private projectService: ProjectsService,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    const vegaFormatOmexManifestUris = BIOSIMULATIONS_FORMATS.filter((format) => format.id === 'format_3969')?.[0]
      ?.biosimulationsMetadata?.omexManifestUris;
    if (vegaFormatOmexManifestUris) {
      this.vegaFormatOmexManifestUris = vegaFormatOmexManifestUris;
    } else {
      throw new Error('Vega format (EDAM:format_3969) must be annotated with one or more OMEX Manifest URIs');
    }

    const env = this.configService.get('server.env');
    this.endpoints = new Endpoints(env);
    this.appRoutes = new AppRoutes(env);
  }

  public async setStatus(id: string, status: SimulationRunStatus): Promise<SimulationRunModel | null> {
    const model = await this.getModel(id);
    return this.updateModelStatus(model, status);
  }

  public async createRunWithFile(
    run: UploadSimulationRun,
    file: Buffer | Readable,
    size: number,
  ): Promise<SimulationRunModelReturnType> {
    const id = String(new mongo.ObjectId());

    try {
      const s3file = await this.simulationStorageService.uploadSimulationArchive(id, file, size);
      this.logger.debug(`Uploaded simulation archive to S3: ${s3file}`);

      // At this point, we have the URLs of all the files in the archive but we don't use them
      // We should save them to the files collection along with size information.
      // then the post processing just needs to give us information about the format from the manifest

      const url = encodeURI(s3file);

      return this.createRun(id, run, url, size);
    } catch (err: any) {
      const details = `An error occurred in creating a run for the COMBINE/OMEX archive: ${this.getErrorMessage(err)}.`;
      this.logger.error(details);

      const message = `An error occurred in creating a run for the COMBINE/OMEX archive${
        err instanceof Error && err.message ? ': ' + err?.message : ''
      }.`;
      throw new BiosimulationsException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Simulation run could not be created',
        message,
        undefined,
        undefined,
        undefined,
        undefined,
        { err: err },
      );
    }
  }

  public async createRunWithURL(body: UploadSimulationRunUrl): Promise<SimulationRunModelReturnType> {
    const url = body.url;
    const id = String(new mongo.ObjectId());
    return this.createRun(id, body, url, undefined);
  }
  /**
   * Download the COMBINE/OMEX archive file for the provided id. The archive is provided as a URL on the fileUrl field
   * @param id The id of the simulation
   *
   */
  public async getFileUrl(id: string): Promise<string> {
    // Find the simulation with the id
    const run = await this.simulationRunModel.findOne({ id }, { fileUrl: 1 }).exec();

    if (!run) {
      throw new NotFoundException(`Simulation run with id '${id}' could not be found.`);
    }

    if (!run.fileUrl) {
      throw new NotFoundException(
        'The COMBINE/OMEX archive for the requested simulation run is not available yet because it has not yet been saved to the database.',
      );
    }

    return run.fileUrl;
  }

  public async deleteAll(): Promise<void> {
    const count = await this.projectService.getCount();
    if (count > 0) {
      throw new BadRequestException(`${count} runs cannot be deleted because they have been published as projects.`);
    }

    const runs = await this.simulationRunModel.find({}).select('id').exec();

    await Promise.all(runs.map((run) => this.delete(run.id)));
  }

  public async delete(id: string): Promise<void> {
    const projectId = await this.projectService.getProjectIdBySimulationRunId(id);
    if (projectId) {
      throw new BadRequestException(
        `Simulation run '${id}' cannot be deleted because it has been published as project '${projectId}'.`,
      );
    }

    const run = await this.simulationRunModel.findOneAndDelete({ id });
    if (!run) {
      throw new NotFoundException(`Simulation run with id '${id}' could not be found.`);
    }

    await this.simulationStorageService.deleteSimulationArchive(id);
    await this.filesService.deleteSimulationRunFiles(id);
    await this.specificationsService.deleteSimulationRunSpecifications(id);

    try {
      await this.logsService.deleteLog(id);
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        throw error;
      }
    }

    try {
      await this.metadataService.deleteSimulationRunMetadata(id);
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        throw error;
      }
    }

    await this.simulationStorageService.deleteSimulation(id);
  }

  public async update(id: string, run: UpdateSimulationRun): Promise<SimulationRunModelReturnType> {
    const model = await this.getModel(id);

    if (!model) {
      throw new NotFoundException(`Simulation run with id '${id}' could not be found.`);
    }

    this.updateModelFileUrl(model, run.fileUrl);
    this.updateModelProjectSize(model, run.projectSize);
    this.updateModelResultSize(model, run.resultsSize);
    this.updateModelStatus(model, run.status);

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

  public async getRunSummaries(raiseErrors = false): Promise<SimulationRunSummary[]> {
    const runs = await this.simulationRunModel.find({}).select('id status').exec();

    const runSummaryResults = await Promise.all(
      runs.map((run): Promise<PromiseResult<SimulationRunSummary>> => {
        return this.getRunSummary(run.id, raiseErrors)
          .then((value) => {
            return {
              id: run.id,
              succeeded: true,
              value: value,
            };
          })
          .catch((error: AxiosError) => {
            return {
              id: run.id,
              succeeded: false,
              error: error,
            };
          });
      }),
    );

    const failures = runSummaryResults.filter((runSummaryResult: PromiseResult<SimulationRunSummary>): boolean => {
      return !runSummaryResult.succeeded;
    });
    if (failures.length) {
      const details: string[] = [];
      const summaries: string[] = [];
      failures.forEach((runSummaryResult: PromiseResult<SimulationRunSummary>) => {
        const error = runSummaryResult?.error;
        details.push(
          `A summary of run '${runSummaryResult.id}' could not be retrieved: ${this.getErrorMessage(error)}.`,
        );
        summaries.push(runSummaryResult.id as string);
      });

      this.logger.error(`Summaries of ${failures.length} runs could not be obtained:\n  ${details.join('\n  ')}`);
      throw new InternalServerErrorException(
        `Summaries of ${failures.length} runs could not be obtained:\n  ${summaries.join('\n  ')}`,
      );
    }

    return runSummaryResults.flatMap(
      (runSummaryResult: PromiseResult<SimulationRunSummary>): SimulationRunSummary[] => {
        if (runSummaryResult.value) {
          return [runSummaryResult.value];
        } else {
          return [];
        }
      },
    );
  }

  public static summaryVersion = 1;

  public async getRunSummary(id: string, raiseErrors = false): Promise<SimulationRunSummary> {
    const cacheKey = `SimulationRun:summary:${raiseErrors}:${id}:${SimulationRunService.summaryVersion}`;
    const cachedValue = (await this.cacheManager.get(cacheKey)) as SimulationRunSummary | null;
    if (cachedValue) {
      return cachedValue;
    } else {
      const value = await this._getRunSummary(id);
      if (value.run.status === SimulationRunStatus.SUCCEEDED || value.run.status === SimulationRunStatus.FAILED) {
        await this.cacheManager.set(cacheKey, value, { ttl: 0 });
      }
      return value;
    }
  }

  /**
   *
   * @param run A POJO with the fields of the simulation run
   * @param file The file object returned by the Mutter library containing the COMBINE/OMEX archive file
   */
  private async createRun(
    id: string,
    run: UploadSimulationRun,
    fileUrl: string,
    projectSize?: number,
  ): Promise<SimulationRunModelReturnType> {
    const newSimulationRun = new this.simulationRunModel(run);
    const simulator = await this.getSimulator(run.simulator, run.simulatorVersion);
    if (simulator && simulator.image) {
      newSimulationRun.simulatorVersion = simulator.version;
      newSimulationRun.simulatorDigest = simulator.image.digest;
    } else if (simulator === null) {
      throw new BadRequestException(
        `No image for '${run.simulator}:${run.simulatorVersion}' is registered with BioSimulators.`,
      );
    } else {
      throw new InternalServerErrorException(
        `An error occurred in retrieving '${run.simulator}:${run.simulatorVersion}'.`,
      );
    }

    newSimulationRun._id = new mongo.ObjectID(id);
    newSimulationRun.id = String(newSimulationRun._id);
    newSimulationRun.fileUrl = fileUrl;

    newSimulationRun.projectSize = projectSize;
    await newSimulationRun.save();

    return toApi(newSimulationRun);
  }

  private getSimulator(simulator: string, simulatorVersion = 'latest'): Promise<ISimulator | null | false> {
    const url = this.endpoints.getSimulatorsEndpoint(false, simulator, simulatorVersion);

    return firstValueFrom(
      this.httpService.get<ISimulator>(url).pipe(
        this.getRetryBackoff(),
        catchError((error: AxiosError): Observable<null | false> => {
          this.logger.error(error.message);
          if (error?.response?.status === HttpStatus.NOT_FOUND) {
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

  private getRetryBackoff(): <T>(source: Observable<T>) => Observable<T> {
    return retryBackoff({
      initialInterval: 100,
      maxRetries: 10,
      resetOnSuccess: true,
      shouldRetry: (error: AxiosError): boolean => {
        const value =
          error.isAxiosError &&
          [
            HttpStatus.REQUEST_TIMEOUT,
            HttpStatus.INTERNAL_SERVER_ERROR,
            HttpStatus.BAD_GATEWAY,
            HttpStatus.GATEWAY_TIMEOUT,
            HttpStatus.SERVICE_UNAVAILABLE,
            HttpStatus.TOO_MANY_REQUESTS,
            undefined,
            null,
          ].includes(error?.response?.status);
        return value;
      },
    });
  }

  private updateModelRunTime(model: SimulationRunModel): SimulationRunModel {
    model.runtime = Date.now() - model.submitted.getTime();
    this.logger.debug(`Set '${model.id}' runtime to ${model.runtime}.`);
    return model;
  }

  private updateModelFileUrl(model: SimulationRunModel, fileUrl: string | undefined): SimulationRunModel {
    if (fileUrl !== undefined) {
      model.fileUrl = fileUrl;
      this.logger.debug(`Set fileUrl of simulation run '${model.id}' to '${fileUrl}'.`);
    }
    return model;
  }

  private updateModelProjectSize(model: SimulationRunModel, projectSize: number | undefined): SimulationRunModel {
    if (projectSize !== undefined) {
      model.projectSize = projectSize;
      this.logger.debug(`Set projectSize of simulation run '${model.id}' to '${projectSize}'.`);
    }
    return model;
  }

  private updateModelStatus(
    model: SimulationRunModel | null,
    status: SimulationRunStatus | undefined,
  ): SimulationRunModel | null {
    let allowUpdate = true;

    if (!model) {
      allowUpdate = false;
    } else if (model.status == SimulationRunStatus.SUCCEEDED || model.status == SimulationRunStatus.FAILED || !status) {
      // succeeded and failed should not be updated
      allowUpdate = false;
    } else if (model.status == SimulationRunStatus.PROCESSING) {
      // processing should not go back to created, queued or running
      allowUpdate = ![SimulationRunStatus.CREATED, SimulationRunStatus.QUEUED, SimulationRunStatus.RUNNING].includes(
        status,
      );
    } else if (model.status == SimulationRunStatus.RUNNING) {
      // running should not go back to created or queued
      allowUpdate = ![SimulationRunStatus.CREATED, SimulationRunStatus.QUEUED].includes(status);
    }

    // Careful not to add else here
    if (model && status && allowUpdate) {
      model.status = status;
      model.refreshCount = model.refreshCount + 1;
      this.logger.log(
        `Set status of simulation run '${model.id}' to '${model.status}' on update ${model.refreshCount}.`,
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

  private updateModelResultSize(model: SimulationRunModel, resultsSize: number | undefined): SimulationRunModel {
    if (resultsSize) {
      model.resultsSize = resultsSize;
      this.logger.debug(`Set resultsSize of simulation run '${model.id}' to '${resultsSize}'.`);
    }
    return model;
  }

  private async getModel(id: string): Promise<SimulationRunModel | null> {
    return this.simulationRunModel.findById(id).catch((_) => null);
  }

  private async _getRunSummary(id: string, raiseErrors = false): Promise<SimulationRunSummary> {
    /* get data */
    const settledResults = await Promise.all(
      [
        this.get(id),
        this.filesService.getSimulationRunFiles(id),
        this.specificationsService.getSpecificationsBySimulation(id),
        this.logsService.getLog(id),
        this.metadataService.getMetadata(id),
      ].map((promise: Promise<any>): Promise<PromiseResult<any>> => {
        return promise
          .then((value) => {
            return {
              succeeded: true,
              value: value,
            };
          })
          .catch((error: AxiosError) => {
            return {
              succeeded: false,
              error: error,
            };
          });
      }),
    );

    const runSettledResult: PromiseResult<SimulationRunModelReturnType | null> = settledResults[0];
    const filesResult: PromiseResult<FileModel[]> = settledResults[1];
    const simulationExptsResult: PromiseResult<SpecificationsModel[]> = settledResults[2];
    const logResult: PromiseResult<CombineArchiveLog> = settledResults[3];
    const rawMetadataResult: PromiseResult<SimulationRunMetadataIdModel | null> = settledResults[4];

    if (!runSettledResult.succeeded) {
      const error = runSettledResult?.error;
      this.logger.error(`Simulation run with id '${id}' could not be found: ${this.getErrorMessage(error)}.`);
      throw new NotFoundException(`Simulation run with id '${id}' could not be found.`);
    }

    const errorDetails: string[] = [];
    const errorSummaries: string[] = [];

    if (!filesResult.succeeded || !filesResult.value) {
      const error = filesResult?.error;
      errorDetails.push(`The files for simulation run '${id}' could not be retrieved: ${this.getErrorMessage(error)}.`);
      errorSummaries.push(`The files for simulation run '${id}' could not be retrieved.`);
    }

    if (!simulationExptsResult.succeeded || !simulationExptsResult.value) {
      const error = simulationExptsResult?.error;
      errorDetails.push(
        `The simulation experiments for simulation run '${id}' could not be retrieved: ${this.getErrorMessage(error)}.`,
      );
      errorSummaries.push(`The simulation experiments for simulation run '${id}' could not be retrieved.`);
    }

    if (!logResult.succeeded || !logResult.value) {
      const error = logResult?.error;
      errorDetails.push(`The log for simulation run '${id}' could not be retrieved: ${this.getErrorMessage(error)}.`);
      errorSummaries.push(`The log for simulation run '${id}' could not be retrieved.`);
    }

    /* initialize summary with run information */
    const rawRun = runSettledResult.value as SimulationRunModelReturnType;

    const simulator = await this.getSimulator(rawRun.simulator);
    if (!simulator) {
      throw new NotFoundException(`Simulator '${rawRun.simulator}' for run could be found.`);
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
          url: this.appRoutes.getSimulatorsView(rawRun.simulator),
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
    if (errorDetails.length === 0 && filesResult.value && simulationExptsResult.value && logResult.value) {
      try {
        const files = filesResult.value;
        const simulationExpts = simulationExptsResult.value;
        const log = logResult.value;

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
          const docLocation = simulationExpt.id.startsWith('./') ? simulationExpt.id.substring(2) : simulationExpt.id;

          const modelMap: { [id: string]: SedModel } = {};
          const simulationMap: { [id: string]: SedSimulation } = {};
          simulationExpt.models.forEach((model: SedModel): void => {
            modelMap[model.id] = model;
          });
          simulationExpt.simulations.forEach((simulation: SedSimulation): void => {
            simulationMap[simulation.id] = simulation;
          });

          simulationExpt.tasks
            .flatMap((task: SedAbstractTask): SedTask[] => {
              if (task._type === 'SedTask') {
                return [task as SedTask];
              } else {
                return [];
              }
            })
            .forEach((task: SedTask): void => {
              const uri = docLocation + '/' + task.simulation;

              let modelFormat: EdamTerm | null = null;
              const model = modelMap[task.model];
              const simulation = simulationMap[task.simulation];

              for (const format of BIOSIMULATIONS_FORMATS) {
                if (
                  format?.biosimulationsMetadata?.modelFormatMetadata?.sedUrn &&
                  model.language.startsWith(format?.biosimulationsMetadata?.modelFormatMetadata?.sedUrn)
                ) {
                  modelFormat = format;
                  break;
                }
              }

              const algorithmKisaoId = taskAlgorithmMap[uri] || simulation.algorithm.kisaoId;
              const algorithmKisaoTerm = this.ontologiesService.getOntologyTerm(Ontologies.KISAO, algorithmKisaoId);

              summaryTasks.push({
                uri: docLocation + '/' + task.id,
                id: task.id,
                name: task?.name,
                model: {
                  uri: docLocation + '/' + model.id,
                  id: model.id,
                  name: model?.name,
                  source: model.source,
                  language: {
                    name: modelFormat?.name || undefined,
                    acronym: modelFormat?.biosimulationsMetadata?.acronym || undefined,
                    sedmlUrn: model.language,
                    edamId: modelFormat?.id || undefined,
                    url: modelFormat?.url || undefined,
                  },
                },
                simulation: {
                  type: {
                    id: simulation._type,
                    name: SimulationTypeName[simulation._type as keyof typeof SimulationTypeName],
                    url: 'https://sed-ml.org/',
                  },
                  uri: uri,
                  id: simulation.id,
                  name: simulation?.name,
                  algorithm: {
                    kisaoId: algorithmKisaoId,
                    name: algorithmKisaoTerm?.name || `${algorithmKisaoId} (deprecated)`,
                    url: algorithmKisaoTerm?.url || 'https://www.ebi.ac.uk/ols/ontologies/kisao',
                  },
                },
              });
            });

          simulationExpt.outputs.forEach((output: SedReport | SedPlot2D | SedPlot3D): void => {
            summaryOutputs.push({
              type: {
                id: output._type,
                name: SimulationRunOutputTypeName[output._type],
                url: 'https://sed-ml.org/',
              },
              uri: docLocation + '/' + output.id,
              name: output?.name,
            });
          });
        });

        files.forEach((file: FileModel): void => {
          if (this.vegaFormatOmexManifestUris.includes(file.format)) {
            summaryOutputs.push({
              type: {
                id: 'Vega',
                name: SimulationRunOutputTypeName.Vega,
                url: 'https://vega.github.io/vega/',
              },
              uri: file.location.startsWith('./') ? file.location.substring(2) : file.location,
              name: undefined,
            });
          }
        });
      } catch (error: any) {
        errorDetails.push(
          `An unexpected error occurred in computing the summary for simulation run '${id}': ${this.getErrorMessage(
            error,
          )}.`,
        );
        errorSummaries.push(`An unexpected error occurred in computing the summary for simulation run '${id}'.`);
      }
    }

    if (errorDetails.length > 0 && raiseErrors) {
      this.logger.error(errorDetails.join('\n\n'));
      throw new InternalServerErrorException(errorSummaries.join('\n'));
    }

    if (rawMetadataResult.succeeded && rawMetadataResult.value) {
      summary.metadata = rawMetadataResult.value.metadata.map((rawMetadatum: ArchiveMetadata) => {
        const uriSlashPos = rawMetadatum.uri.search('/');
        const uri = uriSlashPos === -1 ? '.' : rawMetadatum.uri.substring(uriSlashPos + 1);

        return {
          uri: uri,
          title: rawMetadatum?.title,
          abstract: rawMetadatum?.abstract,
          description: rawMetadatum?.description,
          thumbnails: rawMetadatum.thumbnails,
          keywords: rawMetadatum.keywords,
          encodes: rawMetadatum.encodes,
          taxa: rawMetadatum.taxa,
          other: rawMetadatum.other,
          seeAlso: rawMetadatum.seeAlso,
          references: rawMetadatum.references,
          sources: rawMetadatum.sources,
          predecessors: rawMetadatum.predecessors,
          successors: rawMetadatum.successors,
          creators: rawMetadatum.creators,
          contributors: rawMetadatum.contributors,
          funders: rawMetadatum.funders,
          identifiers: rawMetadatum.identifiers,
          citations: rawMetadatum.citations,
          license: rawMetadatum?.license,
          created: rawMetadatum.created,
          modified: rawMetadatum.modified,
        };
      });
    } else if (raiseErrors) {
      const error = rawMetadataResult?.error;
      this.logger.error(
        `The metadata for simulation run '${id}' could not be retrieved: ${this.getErrorMessage(error)}.`,
      );
      throw new InternalServerErrorException(`The metadata for simulation run '${id}' could not be retrieved.`);
    }

    /* return summary */
    return summary;
  }

  private getErrorMessage(error: any): string {
    if (error?.isAxiosError) {
      return `${error?.response?.status}: ${error?.response?.data?.detail || error?.response?.statusText}`;
    } else {
      return `${error?.status || error?.statusCode || error.constructor.name}: ${error?.message}`;
    }
  }
}
