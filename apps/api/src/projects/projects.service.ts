import { ProjectInput } from '@biosimulations/datamodel/api';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SimulationRunModelReturnType } from '../simulation-run/simulation-run.model';
import { SimulationRunStatus } from '@biosimulations/datamodel/common';
import { SimulationRunService } from '../simulation-run/simulation-run.service';
import { FilesService } from '../files/files.service';
import { SpecificationsService } from '../specifications/specifications.service';
import { LogsService } from '../logs/logs.service';
import { MetadataService } from '../metadata/metadata.service';
import { ProjectIdCollation, ProjectModel } from './project.model';
import { DeleteResult } from 'mongodb';
import { Endpoints } from '@biosimulations/config/common';
import { ConfigService } from '@nestjs/config';
import { BiosimulationsException } from '@biosimulations/shared/exceptions';
import { SpecificationsModel, SedReport, SedPlot2D, SedPlot3D, SedDataSet, SedCurve, SedSurface } from '../specifications/specifications.model';
import { Results } from '../results/datamodel';

@Injectable()
export class ProjectsService {
  private logger = new Logger('ProjectsService');

  private endpoints: Endpoints;

  public constructor(
    @InjectModel(ProjectModel.name) private model: Model<ProjectModel>,
    private simulationRunService: SimulationRunService,
    private filesService: FilesService,
    private specificationsService: SpecificationsService,
    private logsService: LogsService,
    private metadataService: MetadataService,
    private config: ConfigService,
  ) {
    const env = config.get('server.env');
    this.endpoints = new Endpoints(env);
  }

  public async getProjects(): Promise<ProjectModel[]> {
    return this.model.find({});
  }

  public async getProject(id: string): Promise<ProjectModel | null> {
    this.logger.log(`Fetching project ${id}`);

    const project = await this.model.findOne({ id }).collation(ProjectIdCollation);
    return project;
  }

  public async createProject(projectInput: ProjectInput): Promise<ProjectModel> {
    await this.validateRunForPublication(projectInput.simulationRun);
    const project = new this.model(projectInput);
    return project.save();
  }

  public async updateProject(
    projectId: string,
    projectInput: ProjectInput,
  ): Promise<ProjectModel | null> {
    await this.validateRunForPublication(projectInput.simulationRun);

    const project = await this.model
      .findOne({ id: projectId })
      .collation(ProjectIdCollation);

    if (project) {
      project.set(projectInput);
      return project.save();
    }
    return project;
  }

  public async deleteProjects(): Promise<void> {
    // delete all projects
    const res: DeleteResult = await this.model.deleteMany({});
    if (res.acknowledged) {
      return;
    }
    throw new Error('Could not delete projects');
  }

  public async deleteProject(projectId: string): Promise<void> {
    const res = await this.model
      .deleteOne({ id: projectId })
      .collation(ProjectIdCollation);
    if (res.acknowledged) {
      return;
    }
    throw new Error('Could not delete project');
  }

  public async validateProject(projectInput: ProjectInput): Promise<void> {
    await this.validateRunForPublication(projectInput.simulationRun);
    const project = new this.model(projectInput);
    await project.validate();
  }

  /* Check that the simulation run is valid for publication
   *
   * * Run: was successful (`SUCCEEDED` state)
   * * Files: valid and accessible
   * * Simulation specifications: valid and accessible
   * * Results: valid and accessible
   * * Logs: valid and accessible
   * * Metatadata: valid and meets minimum requirements
   *
   * @param id id of the simulation run
   */
  private async validateRunForPublication(
    id: string,
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
      throw new BiosimulationsException(400,
        'Simulation run is not valid for publication.',
        `A simulation run with id ${id} could not be found. Only successful simulation runs can be published.`
      );
    }

    const errors: string[] = [];

    /**
     * Check run
     */

    if (run.status !== SimulationRunStatus.SUCCEEDED) {
      errors.push(`The run did not succeed. The status of the run is ${run.status}. Only successful simulation runs can be published.`);
    }
    
    if (!run.projectSize) {
      errors.push(`The run did not succeed. The status of the run is ${run.status}. Only successful simulation runs can be published.`);
    }

    if (!run.resultsSize) {
      errors.push(`The run did not succeed. The status of the run is ${run.status}. Only successful simulation runs can be published.`);
    }

    if (errors.length) {
      throw new BiosimulationsException(
        400,
        'Simulation run is not valid for publication.',
        errors.join('\n\n')
      );
    }

    /**
     * Check files, SED-ML, results, logs, metadata
     */

    const checks = [
      {
        check: this.filesService.getSimulationFiles(id),
        errorMessage: `Files (contents of COMBINE archive) could not be found for simulation run ${id}.`,        
      },
      {
        check: this.specificationsService.getSpecificationsBySimulation(id),
        errorMessage: `Simulation specifications (SED-ML documents) could not be found for simulation run ${id}. For publication, simulation experiments must be valid SED-ML documents. Please check that the SED-ML documents in the COMBINE archive are valid. More information is available at https://biosimulators.org/conventions/simulation-experiments and https://run.biosimulations.org/utils/validate-project.`,
      },
      {
        check: this.resultsService.getResults(id),
        errorMessage: `Simulation results could not be found for run ${id}. For publication, simulation runs produce at least one SED-ML report or plot.`,
      },
      {
        check: this.logsService.getLog(id),
        errorMessage: `Simulation log could not be found for run ${id}. For publication, simulation runs must have validate logs. More information is available at https://biosimulators.org/conventions/simulation-logs.`,
      },
      {
        check: this.metadataService.getMetadata(id),
        errorMessage: `Metadata could not be found for simulation run ${id}. For publication, simulation runs must meet BioSimulations' minimum metadata requirements. More information is available at https://biosimulators.org/conventions/metadata and https://run.biosimulations.org/utils/validate-project.`,
      },
    ];

    const checkResults: PromiseSettledResult<any>[] =
      await Promise.allSettled(checks.maps((check) => check.check));
    
    for (let iCheck = 0; iCheck < checks.length; iCheck++) {
      const check = checks[iCheck];
      const result = checkResults[iCheck];
      if (result.status == 'rejected') {
        errors.push(check.errorMessage + '\n  ' + result.reason);
      }
    }

    if (checkResults[1] === 'fulfilled' && checkResults[2] === 'fulfilled') {
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
            (output as SedReport).dataSets.forEach((dataSet: SedDataSet): void => {
              expectedDataSetUris.add('Report DataSet: ' + docLocation + '/' + output.id + '/' + dataSet.id);
            })
          } else if (output._type === 'SedPlot2D') {
            (output as SedPlot2D).curves.forEach((curve: SedCurve): void => {
              expectedDataSetUris.add('Plot DataGenerator: ' + docLocation + '/' + output.id + '/' + curve.xDataGenerator.id);
              expectedDataSetUris.add('Plot DataGenerator: ' + docLocation + '/' + output.id + '/' + curve.yDataGenerator.id);
            });
          } else {
            (output as SedPlot3D).surfaces.forEach((surface: SedSurface): void => {
              expectedDataSetUris.add('Plot DataGenerator: ' + docLocation + '/' + output.id + '/' + surface.xDataGenerator.id);
              expectedDataSetUris.add('Plot DataGenerator: ' + docLocation + '/' + output.id + '/' + surface.yDataGenerator.id);
              expectedDataSetUris.add('Plot DataGenerator: ' + docLocation + '/' + output.id + '/' + surface.zDataGenerator.id);
            });
          }
        });
      });

      const dataSetUris = new Set<string>();
      results.outputs.forEach((output): void => {
        let docLocationOutputId = output.outputId;
        if (docLocationOutputId.startsWith('./')) {
          docLocationOutputId = docLocationOutputId.substring(2);
        }

        const type = output.type === 'SedReport' ? 'Report DataSet' : 'Plot DataGenerator';

        output.data.forEach((data): void => {
          dataSetUris.add(type + ': ' + docLocationOutputId + '/' + data.id)
        });
      });

      unproducedDatSetUris = [...expectedDataSetUris].filter(uri => !dataSetUris.has(uri));

      if (expectedDataSetUris.size === 0) {
        errors.push('Simulation run does not specify any SED reports or plots. For publication, simulation runs must produce data for at least one SED-ML report or plot.');
      } else if (unproducedDatSetUris.length) {
        unproducedDatSetUris.sort();
        errors.push((
          'One or more data sets of reports or data generators of plots was not recorded. '
          + 'For publication, there must be simulation results for each data set and data '
          + 'generator specified in each SED-ML documents in the COMBINE archive. The '
          + 'following data sets and data generators were not recorded.\n\n  * '
          + unproducedDatSetUris.join('\n  * ')
        ));
      }
    }

    if (errors.length) {
      throw new BiosimulationsException(
        400,
        'Simulation run is not valid for publication.',
        errors.join('\n\n'),
      );
    }

    return;
  }
}
