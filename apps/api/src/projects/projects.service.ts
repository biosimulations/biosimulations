import {
  ProjectInput,
  ProjectSummary,
  Account,
  Organization,
} from '@biosimulations/datamodel/api';
import { AccountType } from '@biosimulations/datamodel/common';
import {
  Injectable,
  Inject,
  Logger,
  NotFoundException,
  InternalServerErrorException,
  ForbiddenException,
  BadRequestException,
  HttpStatus,
  CACHE_MANAGER,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SimulationRunService } from '../simulation-run/simulation-run.service';
import { ProjectIdCollation, ProjectModel } from './project.model';
import { DeleteResult } from 'mongodb';
import { Endpoints } from '@biosimulations/config/common';
import { ConfigService } from '@nestjs/config';
import { AuthToken } from '@biosimulations/auth/common';
import { isAdmin } from '@biosimulations/auth/nest';
import { BiosimulationsException } from '@biosimulations/shared/exceptions';
import { scopes } from '@biosimulations/auth/common';
import { ManagementService as AccountManagementService } from '@biosimulations/account/management';
import { Organization as Auth0Organization } from 'auth0';

interface ProjectSummaryResult {
  id: string;
  succeeded: boolean;
  value?: ProjectSummary;
  error?: any;
}

@Injectable()
export class ProjectsService {
  private logger = new Logger('ProjectsService');

  private endpoints: Endpoints;

  public constructor(
    @InjectModel(ProjectModel.name) private model: Model<ProjectModel>,
    private simulationRunService: SimulationRunService,
    private accountManagementService: AccountManagementService,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    const env = configService.get('server.env');
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
    this.logger.log(`Fetching project '${id}'.`);

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
  ): Promise<void> {
    await this.simulationRunService.validateRun(projectInput.simulationRun);

    projectInput.owner = this.getOwner(projectInput, user);

    const project = new this.model(projectInput);

    await project.save();
    return;
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
  ): Promise<void | null> {
    if (projectInput.id !== id) {
      throw new BadRequestException(
        `The project id must be '${id}'. Project ids cannot be changed. Please contact the BioSimulations Team (info@biosimulations.org) for assistance.`,
      );
    }

    const project = await this.model
      .findOne({ id: id })
      .collation(ProjectIdCollation);

    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found.`);
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
    await project.save();
    return;
  }

  /** Delete all projects
   */
  public async deleteProjects(): Promise<void> {
    const res: DeleteResult = await this.model.deleteMany({});
    const count = await this.model.count();
    if (count !== 0) {
      throw new InternalServerErrorException(
        'Some projects could not be deleted.',
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
      throw new NotFoundException(
        `Project with id '${id}' could not be found.`,
      );
    }

    const res: DeleteResult = await this.model
      .deleteOne({ id: id })
      .collation(ProjectIdCollation);
    if (res.deletedCount !== 1) {
      throw new InternalServerErrorException(
        'The project could not be deleted.',
      );
    }
    return;
  }

  /** Get a summary of each project
   */
  public async getProjectSummaries(): Promise<ProjectSummary[]> {
    const projects = await this.model.find({}).select('id').exec();
    const promises = projects.map((project): Promise<ProjectSummaryResult> => {
      return this.getProjectSummary(project.id)
        .then((value: ProjectSummary) => {
          return {
            id: project.id,
            succeeded: true,
            value: value,
          };
        })
        .catch((error) => {
          return {
            id: project.id,
            succeeded: false,
            error: error,
          };
        });
    });
    const settledResults = await Promise.all(promises);

    const failures = settledResults
      .filter((settledResult: ProjectSummaryResult): boolean => {
        return !settledResult.succeeded;
      });
    if (failures.length) {
      const msgs = failures
        .map((settledResult: ProjectSummaryResult): string => {
          return `Project ${settledResult.id}: ${settledResult.error.status}: ${settledResult.error.message}`;
        });
      this.logger.log(
        `Summaries could not be obtained for ${failures.length} projects:\n  ${msgs.join('\n  ')}`,
      );
      throw new InternalServerErrorException(
        `Summaries could not be retrieved for ${failures.length} projects.`,
      );
    }

    return settledResults.flatMap(
      (
        settledResult: ProjectSummaryResult,
      ): ProjectSummary[] => {
        if (settledResult.value) {
          return [settledResult.value];
        } else {
          return [];
        }
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
      throw new NotFoundException(
        `Project with id '${id}' could not be found.`,
      );
    }

    const ownerAuth0Id = project?.owner;
    let owner: Account | undefined;
    if (ownerAuth0Id) {
      owner = await this.getAccount(ownerAuth0Id);
    }

    return {
      id: id,
      simulationRun: await this.simulationRunService.getRunSummary(
        project.simulationRun,
        true,
      ),
      owner: owner,
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
    validateIdAvailable = false,
    validateSimulationRunNotPublished = false,
  ): Promise<void> {
    const errors: string[] = [];

    if (validateIdAvailable) {
      const numProjects = await this.model
        .findOne({ id: projectInput.id })
        .collation(ProjectIdCollation)
        .count();
      if (numProjects >= 1) {
        errors.push(
          `The id '${projectInput.id}' is already taken by another project. Each project must have a unique id. Please choose another id.`,
        );
      }
    }

    if (validateSimulationRunNotPublished) {
      const project = await this.model
        .findOne({ simulationRun: projectInput.simulationRun })
        .select('id')
        .collation(ProjectIdCollation);
      if (project) {
        errors.push(
          `Simulation run '${projectInput.simulationRun}' has already been published as project '${project.id}'. Each run can only be published once.`,
        );
      }
    }

    try {
      await this.simulationRunService.validateRun(
        projectInput.simulationRun,
        validateSimulationResultsData,
      );
    } catch (error) {
      const message =
        error instanceof BiosimulationsException && error.message
          ? error.message
          : 'Error validating run';
      errors.push(message);
    }

    const project = new this.model(projectInput);
    try {
      await project.validate();
    } catch (error) {
      errors.push(
        error instanceof Error && error.message
          ? error.message
          : 'Validation of project failed',
      );
    }

    if (errors.length) {
      throw new BiosimulationsException(
        HttpStatus.BAD_REQUEST,
        'Project is invalid',
        errors.join('\n\n'),
      );
    }
  }
  private getOwner(
    projectInput: ProjectInput,
    user: AuthToken,
  ): string | undefined {
    if (projectInput?.owner) {
      if (user?.permissions?.includes(scopes.projects.proxyOwnership.id)) {
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

    if (!user?.permissions?.includes(scopes.projects.proxyOwnership.id)) {
      return user?.sub;
    }

    return undefined;
  }

  /** Get information about an account from Auth0
   * @param auth0Id: Auth0 user or client id
   */
  private async _getAccount(auth0Id: string): Promise<Account> {
    let type!: AccountType;
    let id!: string;
    let name!: string;
    let url!: string | undefined;

    let organizationsDetails!: Auth0Organization[];
    if (this.accountManagementService.isClientId(auth0Id)) {
      type = AccountType.machine;
      const client = await this.accountManagementService.getClient(auth0Id);
      id = client.client_metadata.id;
      name = client.name as string;
      url = client.client_metadata?.url;

      const organizationIds = JSON.parse(client.client_metadata.organizations);
      organizationsDetails = await Promise.all(
        organizationIds.map(
          (organizationId: string): Promise<Auth0Organization> => {
            return this.accountManagementService.getOrganization(
              organizationIds,
            );
          },
        ),
      );
    } else {
      type = AccountType.user;
      const user = await this.accountManagementService.getUser(auth0Id);
      id = user?.user_metadata?.username as string;
      name = user?.name as string;
      url = user?.user_metadata?.url;

      organizationsDetails =
        await this.accountManagementService.getUserOrganizations(auth0Id);
    }
    const organizations = organizationsDetails.map(
      (organization: Auth0Organization): Organization => {
        return {
          id: organization.name,
          name: organization?.display_name || organization.name,
          url: organization?.metadata?.url,
        };
      },
    );

    return {
      type,
      id,
      name,
      url,
      organizations,
    };
  }

  /** Get information about an account from the cache or from Auth0 if its not in the cache
   * @param auth0Id: Auth0 user or client id
   */
  private async getAccount(auth0Id: string): Promise<Account> {
    const cacheKey = `Account:info:${auth0Id}`;
    const cachedAccount = (await this.cacheManager.get(
      cacheKey,
    )) as Account | null;

    if (cachedAccount) {
      return cachedAccount;
    } else {
      const account = await this._getAccount(auth0Id);
      await this.cacheManager.set(cacheKey, account, { ttl: 60 * 24 }); // 1 day; to enable users and organizations to change their names
      return account;
    }
  }
}
