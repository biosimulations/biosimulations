import {
  ProjectInput,  
} from '@biosimulations/datamodel/api';
import {
  Injectable,
  Logger,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SimulationRunService } from '../simulation-run/simulation-run.service';
import { ProjectIdCollation, ProjectModel } from './project.model';
import { DeleteResult } from 'mongodb';
import { Endpoints } from '@biosimulations/config/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProjectsService {
  private logger = new Logger('ProjectsService');

  private endpoints: Endpoints;

  public constructor(
    @InjectModel(ProjectModel.name) private model: Model<ProjectModel>,
    private simulationRunService: SimulationRunService,    
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
    await this.simulationRunService.validateRun(projectInput.simulationRun);
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
    await this.simulationRunService.validateRun(projectInput.simulationRun);

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

  /** Check if a project is valid
   *
   * @param projectInput project
   * @param validateSimulationResultsData whether to validate the data for each SED-ML report and plot of each SED-ML document
   */
  public async validateProject(
    projectInput: ProjectInput,
    validateSimulationResultsData = false,
  ): Promise<void> {
    await this.simulationRunService.validateRun(
      projectInput.simulationRun,
      validateSimulationResultsData,
    );
    const project = new this.model(projectInput);
    await project.validate();
  }
}
