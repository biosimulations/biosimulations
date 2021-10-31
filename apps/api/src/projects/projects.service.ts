import { ProjectInput, ProjectSummary } from '@biosimulations/datamodel/api';
import {
  Injectable,
  Logger,
  NotFoundException,
  InternalServerErrorException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SimulationRunService } from '../simulation-run/simulation-run.service';
import { ProjectIdCollation, ProjectModel } from './project.model';
import { DeleteResult } from 'mongodb';
import { Endpoints } from '@biosimulations/config/common';
import { ConfigService } from '@nestjs/config';
import { AuthToken } from '@biosimulations/auth/common';
import { isAdmin } from '@biosimulations/auth/nest';

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
   * @param user User who submitted the project
   */
  public async createProject(
    projectInput: ProjectInput,
    user: AuthToken,
  ): Promise<ProjectModel> {
    await this.simulationRunService.validateRun(projectInput.simulationRun);

    projectInput.owner = this.getOwner(projectInput, user);

    const project = new this.model(projectInput);

    return project.save();
  }

  /** Modify a project in the database
   *
   * @param id id of the project
   * @param projectInput new properties of the project
   * @param user User attempting to modify the project
   */
  public async updateProject(
    id: string,
    projectInput: ProjectInput,
    user: AuthToken,
  ): Promise<ProjectModel | null> {
    if (projectInput.id !== id) {
      throw new BadRequestException(
        `The project id must be '${id}'. Project ids cannot be changed. Please contact the BioSimulations Team (info@biosimulations.org) for assistance.`,
      );
    }

    const project = await this.model
      .findOne({ id: id })
      .collation(ProjectIdCollation);

    if (!project) {
      return null;
    }

    const owner = this.getOwner(projectInput, user);

    if (!isAdmin(user) && (project?.owner !== owner || !project?.owner)) {
      throw new ForbiddenException(
        `This account does not have permissions to update project '${id}'. Projects can only be updated by the accounts which created them. Anonymously created projects can only be updated by the BioSimulations Team. Please contact the BioSimulations Team (info@biosimulations.org) for assistance.`,
      );
    }

    if (projectInput.simulationRun !== project.simulationRun) {
      await this.simulationRunService.validateRun(projectInput.simulationRun);
    }

    project.set(projectInput);
    return project.save();
  }

  private getOwner(
    projectInput: ProjectInput,
    user: AuthToken,
  ): string | undefined {
    if (projectInput?.owner) {
      if (user?.permissions?.includes('proxyOwnership:Projects')) {
        return projectInput.owner;
      } else {
        throw new ForbiddenException(
          'Only administrators can submit projects on behalf of other accounts.',
        );
      }
    }

    if (!user?.sub) {
      return undefined;
    }

    if (user.sub.search(/\|/) !== -1) {
      return user.sub;
    }

    if (!user?.permissions?.includes('proxyOwnership:Projects')) {
      return user?.sub;
    }

    return undefined;
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
      throw new NotFoundException(`Project with id '${id}' could not be found`);
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

  /** Get a summary of each project
   */
  public async getProjectSummaries(): Promise<ProjectSummary[]> {
    const projects = await this.model.find({}).select('id').exec();
    const promises = projects.map((project): Promise<ProjectSummary> => {
      return this.getProjectSummary(project.id);
    });
    const settledResults = await Promise.allSettled(promises);
    return settledResults.map(
      (
        settledResult: PromiseSettledResult<ProjectSummary>,
        iProject: number,
      ): ProjectSummary => {
        if (
          settledResult.status !== 'fulfilled' ||
          !('value' in settledResult)
        ) {
          this.logger.log(
            `Error getting summary for project ${projects[iProject].id}`,
          );
          throw new InternalServerErrorException(
            'Summaries could not be retrieved for one or more projects.',
          );
        }
        return settledResult.value;
      },
    );
  }

  /** Get a summary of a project
   *
   * @param id id of the project
   */
  public async getProjectSummary(id: string): Promise<ProjectSummary> {
    const project = await this.model
      .findOne({ id })
      .collation(ProjectIdCollation);
    if (!project) {
      throw new NotFoundException(`Project with id '${id}' could not be found`);
    }

    return {
      id: id,
      simulationRun: await this.simulationRunService.getRunSummary(
        project.simulationRun,
        true,
      ),
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
    await this.simulationRunService.validateRun(
      projectInput.simulationRun,
      validateSimulationResultsData,
    );
    const project = new this.model(projectInput);
    await project.validate();
  }
}
