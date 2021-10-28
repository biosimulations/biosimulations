import {
  ProjectInput,
  ProjectSummary,
  SimulationTaskSummary,
  SimulationOutputSummary,
  SimulationRunSummary,
  ProjectMetadataSummary,
  ArchiveMetadata,
} from '@biosimulations/datamodel/api';
import {
  Injectable,
  Logger,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SimulationRunModelReturnType } from '../simulation-run/simulation-run.model';
import {
  SimulationRunStatus,
  SimulationRunLogStatus,
  SimulationType,
  SimulationOutputType,
  VEGA_FORMAT,
} from '@biosimulations/datamodel/common';
import { SimulationRunService } from '../simulation-run/simulation-run.service';
import { FilesService } from '../files/files.service';
import { SpecificationsService } from '../specifications/specifications.service';
import { ResultsService } from '../results/results.service';
import { LogsService } from '../logs/logs.service';
import { MetadataService } from '../metadata/metadata.service';
import { ProjectIdCollation, ProjectModel } from './project.model';
import { DeleteResult } from 'mongodb';
import { Endpoints } from '@biosimulations/config/common';
import { ConfigService } from '@nestjs/config';
import { BiosimulationsException } from '@biosimulations/shared/exceptions';
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
export class ProjectsService {
  private logger = new Logger('ProjectsService');

  private endpoints: Endpoints;

  public constructor(
    @InjectModel(ProjectModel.name) private model: Model<ProjectModel>,
    private simulationRunService: SimulationRunService,
    private filesService: FilesService,
    private specificationsService: SpecificationsService,
    private resultsService: ResultsService,
    private logsService: LogsService,
    private metadataService: MetadataService,
    private config: ConfigService,
  ) {
    const env = config.get('server.env');
    this.endpoints = new Endpoints(env);
  }

  /** Get all projects
   */
  public async getProjects(): Promise<ProjectModel[]> {
    return this.model.find({});
  }

  /** Get one project
   *
   * @param id id of the project
   */
  public async getProject(id: string): Promise<ProjectModel | null> {
    this.logger.log(`Fetching project ${id}`);

    const project = await this.model
      .findOne({ id })
      .collation(ProjectIdCollation);
    return project;
  }

  /** Save a project to the database
   *
   * @param projectInput project to save to the database
   */
  public async createProject(
    projectInput: ProjectInput,
  ): Promise<ProjectModel> {
    await this.validateRunForPublication(projectInput.simulationRun);
    const project = new this.model(projectInput);
    return project.save();
  }

  /** Modify a project in the database
   *
   * @param id id of the project
   * @param projectInput new properties of the project
   */
  public async updateProject(
    id: string,
    projectInput: ProjectInput,
  ): Promise<ProjectModel | null> {
    await this.validateRunForPublication(projectInput.simulationRun);

    const project = await this.model
      .findOne({ id: id })
      .collation(ProjectIdCollation);

    if (project) {
      project.set(projectInput);
      return project.save();
    }
    return project;
  }

  /** Delete all projects
   */
  public async deleteProjects(): Promise<void> {
    const res: DeleteResult = await this.model.deleteMany({});
    const count = await this.model.count();
    if (count !== 0) {
      throw new InternalServerErrorException(
        'Some projects could not be deleted',
      );
    }
    return;
  }

  /** Delete one project
   *
   * @param id id of the project
   */
  public async deleteProject(id: string): Promise<void> {
    const project = await this.model
      .findOne({ id })
      .collation(ProjectIdCollation);
    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }

    const res: DeleteResult = await this.model
      .deleteOne({ id: id })
      .collation(ProjectIdCollation);
    if (res.deletedCount !== 1) {
      throw new InternalServerErrorException(
        'The project could not be deleted',
      );
    }
    return;
  }

  public async getProjectSummary(
    id: string,
  ): Promise<ProjectSummary> {
    const project = await this.getProject(id);
    if (!project) {
      throw new NotFoundException(`No project could be found with id '${id}'`);
    }

    /* get data */
    const runId = project.simulationRun;
    const settledResults = (await Promise.allSettled([
      this.filesService.getSimulationFiles(runId),
      this.specificationsService.getSpecificationsBySimulation(runId),
      this.simulationRunService.get(runId),
      this.logsService.getLog(runId),
      this.metadataService.getMetadata(runId),
    ]))
    .map((settledResult) => {
      if (
        settledResult.status !== 'fulfilled'
        || !('value' in settledResult)
        || settledResult.value === null
        || (Array.isArray(settledResult.value) && settledResult.value.length === 0)
      ) {
        throw new NotFoundException(`No project could be found with id '${id}'`);
      }
      return settledResult.value;
    });

    const files = settledResults[0] as FileModel[];
    const simulationExpts = settledResults[1] as SpecificationsModel[];
    const simulationRun = settledResults[2] as SimulationRunModelReturnType;
    const log = settledResults[3] as CombineArchiveLog;
    const metadata = settledResults[4] as SimulationRunMetadataIdModel;

    /* get summary of the simulation experiment */
    const simulationTasks: SimulationTaskSummary[] = [];
    const simulationOutputs: SimulationOutputSummary[] = [];

    simulationExpts.forEach((simulationExpt: SpecificationsModel): void => {
      const docLocation = simulationExpt.id.startsWith('./') ? simulationExpt.id.substring(2) : simulationExpt.id;

      simulationExpt.tasks.forEach((task: SedTask): void => {
        simulationTasks.push({
          uri: docLocation + '/' + task.id,
          id: task.id,
          name: task?.name,
          model: {
            uri: docLocation + '/' + task.model.id,
            id: task.model.id,
            name: task.model?.name,
            source: task.model.source,
            language: task.model.language,
          },
          simulation: {
            _type: SimulationType[task.simulation._type],
            uri: docLocation + '/' + task.simulation.id,
            id: task.simulation.id,
            name: task.simulation?.name,
            algorithm: task.simulation.algorithm.kisaoId, // TODO: get actual rather than requested algorithm
          }
        })
      })

      simulationExpt.outputs.forEach((output: SedReport | SedPlot2D | SedPlot3D): void => {
        simulationOutputs.push({
          _type: SimulationOutputType[output._type],
          uri: docLocation + '/' + output.id,
          name: output?.name,
        });
      });
    });

    files.forEach((file: FileModel): void => {
      if (VEGA_FORMAT.combineUris.includes(file.format)) {
        simulationOutputs.push({
          _type: SimulationOutputType.Vega,
          uri: file.location.startsWith('./') ? file.location.substring(2) : file.location,
          name: undefined,
        });
      }
    });

    /* get summary of simulation run */
    const simulationRunSummary: SimulationRunSummary = {
      id: simulationRun.id,
      name: simulationRun.name,
      simulator: simulationRun.simulator,
      simulatorVersion: simulationRun.simulatorVersion,
      simulatorDigest: simulationRun.simulatorDigest,
      cpus: simulationRun.cpus,
      memory: simulationRun.memory,
      envVars: simulationRun.envVars,
      runtime: log.duration !== null ? log.duration : simulationRun.runtime,
      projectSize: simulationRun.projectSize as number,
      resultsSize: simulationRun.resultsSize,
      submitted: simulationRun.submitted.toString(),
      updated: simulationRun.updated.toString(),
    };
    
    /* get top-level metadata for the project */
    let projectMetadata!: ArchiveMetadata;
    for (projectMetadata of metadata.metadata) {
      if (projectMetadata.uri.search('/') === -1) {
        break;
      }
    }

    const projectMetadataSummary: ProjectMetadataSummary = {
      title: projectMetadata?.title,
      abstract: projectMetadata?.abstract,
      description: projectMetadata?.description,
      thumbnails: projectMetadata.thumbnails,
      sources: projectMetadata.sources,
      keywords: projectMetadata.keywords,
      taxa: projectMetadata.taxa,
      encodes: projectMetadata.encodes,
      predecessors: projectMetadata.predecessors,
      successors: projectMetadata.successors,
      seeAlso: projectMetadata.seeAlso,
      identifiers: projectMetadata.identifiers,
      citations: projectMetadata.citations,
      creators: projectMetadata.creators,
      contributors: projectMetadata.contributors,
      license: projectMetadata?.license,
      funders: projectMetadata.funders,
      other: projectMetadata.other,
      created: projectMetadata.created,
      modified: projectMetadata.modified?.[0] || undefined,
    };

    /* return summary */
    return {
      id: id,
      simulationTasks: simulationTasks,
      simulationOutputs: simulationOutputs,
      simulationRun: simulationRunSummary,
      projectMetadata: projectMetadataSummary,
      created: project.created,
      updated: project.updated,
    };
  }

  /** Check if a project is valid
   *
   * @param projectInput project
   * @param validateSimulationResultsData whether to validate the data for each SED-ML report and plot of each SED-ML document
   */
  public async validateProject(
    projectInput: ProjectInput,
    validateSimulationResultsData = false,
  ): Promise<void> {
    await this.validateRunForPublication(
      projectInput.simulationRun,
      validateSimulationResultsData,
    );
    const project = new this.model(projectInput);
    await project.validate();
  }

  /** Check that a simulation run is valid for publication
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
  private async validateRunForPublication(
    id: string,
    validateSimulationResultsData = false,
  ): Promise<void> {
    let run!: SimulationRunModelReturnType | null;
    try {
      run = await this.simulationRunService.get(id);
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
