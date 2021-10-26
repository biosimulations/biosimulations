import { ProjectInput } from '@biosimulations/datamodel/api';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SimulationRunModelReturnType } from '../simulation-run/simulation-run.model';
import { SimulationRunStatus } from '@biosimulations/datamodel/common';
import { SimulationRunService } from '../simulation-run/simulation-run.service';
import { MetadataService } from '../metadata/metadata.service';
// import { SimulationProjectsService as MetadataErrorService } from '@biosimulations/combine-api-client';
import { ProjectIdCollation, ProjectModel } from './project.model';
import { DeleteResult } from 'mongodb';
import { Endpoints } from '@biosimulations/config/common';
import { ConfigService } from '@nestjs/config';
// import { firstValueFrom } from 'rxjs';
import { BiosimulationsException } from '@biosimulations/shared/exceptions';

@Injectable()
export class ProjectsService {
  private logger = new Logger('ProjectsService');

  private endpoints: Endpoints;

  public constructor(
    @InjectModel(ProjectModel.name) private model: Model<ProjectModel>,
    private simulationRunService: SimulationRunService,
    private metadataService: MetadataService,
    //private metadataErrorService: MetadataErrorService,
    private config: ConfigService,
  ) {
    const env = config.get('server.env');
    this.endpoints = new Endpoints(env);
  }

  public async getProjects(): Promise<ProjectModel[]> {
    return await this.model.find({});
  }

  public async getProject(id: string): Promise<ProjectModel | null> {
    this.logger.log(`Fetching project ${id}`);

    const project = await this.model.findOne({ id }).collation(ProjectIdCollation);
    return project;
  }

  public async createProject(projectInput: ProjectInput): Promise<ProjectModel> {
    await this.validateRunForPublication(projectInput.simulationRun);
    const project = new this.model(projectInput);
    return await project.save();
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
      return await project.save();
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

    const checks: PromiseSettledResult<any>[] =
      await Promise.allSettled([
        // this.fileService.processFiles(id),
        // this.specificationsService.get(id),
        // this.resultsService.get(id)
        // this.logService.createLog(id),
        this.metadataService.getMetadata(id),
      ]);
    
    const metadata = checks[0];
    if (!metadata) {
      /* TODO: debug dependency resolution and copy errors to exception

      const res = await firstValueFrom(
        this.metadataErrorService.srcHandlersCombineGetMetadataForCombineArchiveHandlerBiosimulations(
          'rdfxml',
          undefined,
          this.endpoints.getRunDownloadEndpoint(id, true),
        ));
      */
      errors.push(`Metadata could not be found for simulation run ${id}. For publication, simulation runs must meet BioSimulations' minimum metadata requirements. More information is available at https://biosimulators.org/conventions/metadata.`)
    }

    if (errors.length) {
      throw new BiosimulationsException(
        400, 
        'Simulation run is not valid for publication.', 
        errors.join('\n\n')
      );
    }

    return;
  }
}
