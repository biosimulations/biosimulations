import {
  Account,
  Organization,
  ProjectFilterQueryItem,
  ProjectFilterStatsItem,
  ProjectInput,
  ProjectSummary,
  ProjectSummaryQueryResults,
} from '@biosimulations/datamodel/api';
import { AccountType, getProjectSummaryScore } from '@biosimulations/datamodel/common';
import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SimulationRunService } from '../simulation-run/simulation-run.service';
import { ProjectIdCollation, ProjectModel } from './project.model';
import { DeleteResult } from 'mongodb';
import { ConfigService } from '@nestjs/config';
import { AuthToken, scopes } from '@biosimulations/auth/common';
import { isAdmin } from '@biosimulations/auth/nest';
import { BiosimulationsException } from '@biosimulations/shared/exceptions';
import { ManagementService as AccountManagementService } from '@biosimulations/account/management';
import { Organization as Auth0Organization } from 'auth0';
import { ModuleRef } from '@nestjs/core';
import { SimulationRunValidationService } from '../simulation-run/simulation-run-validation.service';
import { ProjectsSearch } from './projects.search';
import { applyFilter, gatherFilterValueStatistics } from './projects.filter';

interface ProjectSummaryResult {
  id: string;
  succeeded: boolean;
  value?: ProjectSummary;
  error?: any;
}

const maxNumRecordsToTextSearch = 3000;

@Injectable()
export class ProjectsService implements OnModuleInit {
  private logger = new Logger('ProjectsService');

  private simulationRunService!: SimulationRunService;
  private projectSearch?: ProjectsSearch;
  private fullFilterStats?: ProjectFilterStatsItem[];

  public constructor(
    @InjectModel(ProjectModel.name)
    private model: Model<ProjectModel>,
    private moduleRef: ModuleRef,
    private accountManagementService: AccountManagementService,
    private configService: ConfigService,
    @Inject(forwardRef(() => SimulationRunValidationService))
    private simulationRunValidationService: SimulationRunValidationService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  public onModuleInit(): void {
    this.simulationRunService = this.moduleRef.get(SimulationRunService, {
      strict: false,
    });
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

    const project = await this.model.findOne({ id }).collation(ProjectIdCollation);

    return project;
  }

  /** Get the id of a project that has the underlying simulation run of simulationRunId
   * @Param simulationRunId id of the simulation run of the published project
   */

  public async getProjectIdBySimulationRunId(simulationRunId: string): Promise<string | undefined> {
    const project = await this.model.findOne({ simulationRun: simulationRunId }).select('id').exec();
    return project?.id;
  }

  public async getCount(): Promise<number> {
    return this.model.count();
  }
  /** Save a project to the database
   *
   * @param projectInput project to save to the database
   * @param user User who submitted the project
   */
  public async createProject(projectInput: ProjectInput, user: AuthToken): Promise<void> {
    // validate project
    await this.simulationRunValidationService.validateRun(projectInput.simulationRun);

    // create project
    projectInput.owner = this.getOwner(projectInput, user);

    const project = new this.model(projectInput);

    await project.save();

    // cache project summary
    await this.getProjectSummary(projectInput.id);

    // return
    return;
  }

  /** Modify a project in the database
   *
   * @param id id of the project
   * @param projectInput new properties of the project
   * @param user User attempting to modify the project
   */
  public async updateProject(id: string, projectInput: ProjectInput, user: AuthToken): Promise<void | null> {
    if (projectInput.id !== id) {
      throw new BadRequestException(
        `The project id must be '${id}'. Project ids cannot be changed. Please contact the BioSimulations Team (info@biosimulations.org) for assistance.`,
      );
    }

    // get project
    const project = await this.model.findOne({ id: id }).collation(ProjectIdCollation);

    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found.`);
    }

    // check permissions
    const owner = this.getOwner(projectInput, user);

    if (!isAdmin(user) && (project?.owner !== owner || !project?.owner)) {
      throw new ForbiddenException(
        `This account does not have permissions to update project '${id}'. Simulation projects can only be updated by the accounts which created them. Anonymously created projects can only be updated by the BioSimulations Team. Please contact the BioSimulations Team (info@biosimulations.org) for assistance.`,
      );
    }

    // validate and save project and update summary
    if (projectInput.simulationRun !== project.simulationRun) {
      // validate project
      await this.simulationRunValidationService.validateRun(projectInput.simulationRun);

      // save project
      project.set(projectInput);
      await project.save();

      // cache project summary
      await this.getProjectSummary(projectInput.id);
    }

    // return
    return;
  }

  /** Delete all projects
   */
  public async deleteProjects(): Promise<void> {
    const res: DeleteResult = await this.model.deleteMany({});
    const count = await this.model.count();
    if (count !== 0) {
      throw new InternalServerErrorException('Some projects could not be deleted.');
    }
    return;
  }

  /** Delete one project
   *
   * @param id id of the project
   */
  public async deleteProject(id: string): Promise<void> {
    const project = await this.model.findOne({ id }).collation(ProjectIdCollation);
    if (!project) {
      throw new NotFoundException(`Project with id '${id}' could not be found.`);
    }

    const res: DeleteResult = await this.model.deleteOne({ id: id }).collation(ProjectIdCollation);
    if (res.deletedCount !== 1) {
      throw new InternalServerErrorException('The project could not be deleted.');
    }
    return;
  }

  /** Get a summary of each project
   */
  public async getProjectSummaries(): Promise<ProjectSummary[]> {
    const projects = await this.model.find({}).select('id updated').exec();
    const projectIds = projects
      .map((project: ProjectModel): string => {
        const updated = project.updated.toISOString();
        return `${project.id}-${updated}`;
      })
      .sort()
      .join(',');
    const cacheKey = `Project:Summaries:${projectIds}:${SimulationRunService.summaryVersion}`;
    return this.getWithCache<ProjectSummary[]>(cacheKey, this._getProjectSummaries.bind(this, projects), 0);
  }

  /** Get a summary of each project
   */
  public async getProjectSummariesWithoutSearch(
    pageSize: number,
    pageIndex: number,
    filters: ProjectFilterQueryItem[],
  ): Promise<ProjectSummaryQueryResults> {
    return this.getProjectSummariesWithoutSearch_withoutSort(maxNumRecordsToTextSearch, 0, filters).then(
      (results: ProjectSummaryQueryResults) => {
        return {
          ...results,
          projectSummaries: results.projectSummaries
            .sort((p1: ProjectSummary, p2: ProjectSummary) => getProjectSummaryScore(p2) - getProjectSummaryScore(p1))
            .slice(pageIndex * pageSize, (pageIndex + 1) * pageSize),
        } as ProjectSummaryQueryResults;
      },
    );
  }

  public async getProjectSummariesWithoutSearch_withoutSort(
    pageSize: number,
    pageIndex: number,
    filters: ProjectFilterQueryItem[],
  ): Promise<ProjectSummaryQueryResults> {
    if (!this.fullFilterStats) {
      const allProjects: ProjectModel[] = await this.model.find({}).select('id updated').exec();
      const projectIds: string = allProjects
        .map((project: ProjectModel): string => {
          const updated = project.updated.toISOString();
          return `${project.id}-${updated}`;
        })
        .sort((a: string, b: string): number => a.localeCompare(b))
        .join(',');
      const cacheKey = `Project:Summaries:${projectIds}:${SimulationRunService.summaryVersion}`;
      const allProjectSummaries: ProjectSummary[] = await this.getWithCache<ProjectSummary[]>(
        cacheKey,
        this._getProjectSummaries.bind(this, allProjects),
        0,
      );
      this.fullFilterStats = gatherFilterValueStatistics(allProjectSummaries);
    }
    if (!filters || filters.length == 0) {
      const projects: ProjectModel[] = await this.model
        .find({})
        .select('id updated')
        .skip(pageSize * pageIndex)
        .limit(pageSize)
        .exec();
      const totalNumProjects: number = await this.model.count();
      const projectIds: string = projects
        .map((project: ProjectModel): string => {
          const updated = project.updated.toISOString();
          return `${project.id}-${updated}`;
        })
        .sort((a: string, b: string): number => a.localeCompare(b))
        .join(',');
      const cacheKey = `Project:Summaries:${projectIds}:${SimulationRunService.summaryVersion}`;
      const projectSummaries: ProjectSummary[] = await this.getWithCache<ProjectSummary[]>(
        cacheKey,
        this._getProjectSummaries.bind(this, projects),
        0,
      );
      return {
        projectSummaries: projectSummaries,
        totalMatchingProjectSummaries: totalNumProjects,
        queryStats: this.fullFilterStats,
      } as ProjectSummaryQueryResults;
    } else {
      const projects: ProjectModel[] = await this.model.find({}).select('id updated').exec();
      const projectIds: string = projects
        .map((project: ProjectModel): string => {
          const updated = project.updated.toISOString();
          return `${project.id}-${updated}`;
        })
        .sort((a: string, b: string): number => a.localeCompare(b))
        .join(',');
      const cacheKey = `Project:Summaries:${projectIds}:${SimulationRunService.summaryVersion}`;
      const projectSummaries: ProjectSummary[] = applyFilter(
        await this.getWithCache<ProjectSummary[]>(cacheKey, this._getProjectSummaries.bind(this, projects), 0),
        filters,
      );
      const startIndex: number = pageIndex * pageSize;
      const endIndex: number = startIndex + pageSize;
      const slicedResults: ProjectSummary[] = projectSummaries.slice(startIndex, endIndex);
      const resultsLength = projectSummaries.length;
      return {
        projectSummaries: slicedResults,
        totalMatchingProjectSummaries: resultsLength,
        queryStats: this.fullFilterStats,
      } as ProjectSummaryQueryResults;
    }
  }

  /** Get a summary of each project
   */
  public async searchProjectSummaries(
    pageSize: number,
    pageIndex: number,
    searchText: string,
    filters: ProjectFilterQueryItem[],
  ): Promise<ProjectSummaryQueryResults> {
    const startIndex: number = pageIndex * pageSize;
    const endIndex: number = startIndex + pageSize;
    if (this.projectSearch) {
      const results: ProjectSummary[] = applyFilter(this.projectSearch.search(searchText), filters);
      const filterStats: ProjectFilterStatsItem[] = gatherFilterValueStatistics(results);
      const slicedResults: ProjectSummary[] = results.slice(startIndex, endIndex);
      const resultsLength = results.length;
      // this.logger.debug(`warm-engine: resultsLength=${resultsLength}, pageIndex=${pageIndex},
      //      pageSize=${pageSize}, startIndex=${startIndex}, endIndex=${endIndex}`);
      return {
        projectSummaries: slicedResults,
        totalMatchingProjectSummaries: resultsLength,
        queryStats: filterStats,
      } as ProjectSummaryQueryResults;
    } else {
      // Initialize the search query first (eventually, we'll need it to update on the fly when new projects are added).
      // 1. query first 2000 projects
      // 2. add all projects to ProjectsSearch instance
      // 3. perform the search
      const projectSummaries: Promise<ProjectSummaryQueryResults> = this.getProjectSummariesWithoutSearch_withoutSort(
        maxNumRecordsToTextSearch,
        0,
        [],
      ).then((projectSummaryQueryResults: ProjectSummaryQueryResults) => {
        // 2. add all documents to be indexed with search engine
        const searchEngine = new ProjectsSearch();
        for (const projectSummary of projectSummaryQueryResults.projectSummaries) {
          searchEngine.addDocument(projectSummary);
        }
        this.projectSearch = searchEngine;

        // 3. now do the search
        const results: ProjectSummary[] = applyFilter(this.projectSearch.search(searchText), filters);
        const filterStats: ProjectFilterStatsItem[] = gatherFilterValueStatistics(results);
        const resultsLength: number = results.length;
        // this.logger.debug(`cold-engine: resultsLength=${resultsLength}, pageIndex=${pageIndex},
        //      pageSize=${pageSize}, startIndex=${startIndex}, endIndex=${endIndex}`);
        const slicedResults: ProjectSummary[] = results.slice(startIndex, endIndex);
        return {
          projectSummaries: slicedResults,
          totalMatchingProjectSummaries: resultsLength,
          queryStats: filterStats,
        } as ProjectSummaryQueryResults;
      });
      return projectSummaries;
    }
  }

  private async _getProjectSummaries(projects: ProjectModel[]): Promise<ProjectSummary[]> {
    const promises = projects.map((project): Promise<ProjectSummaryResult> => {
      return this.getProjectSummary(project.id)
        .then((value: ProjectSummary) => {
          return {
            id: project.id,
            succeeded: true,
            value: value,
          };
        })
        .catch((error: any) => {
          return {
            id: project.id,
            succeeded: false,
            error: error,
          };
        });
    });
    const settledResults = await Promise.all(promises);

    const failures = settledResults.filter((settledResult: ProjectSummaryResult): boolean => {
      return !settledResult.succeeded;
    });
    if (failures.length) {
      const msgs = failures.map((settledResult: ProjectSummaryResult): string => {
        const error = settledResult?.error;
        return `Project ${settledResult.id}: ${error?.isAxiosError ? error?.response?.status : error?.status}: ${
          error?.isAxiosError ? error?.response?.data?.detail || error?.response?.statusText : error?.message
        }`;
      });
      this.logger.error(`Summaries could not be obtained for ${failures.length} projects:\n  ${msgs.join('\n  ')}`);
      throw new InternalServerErrorException(`Summaries could not be retrieved for ${failures.length} projects.`);
    }

    return settledResults.flatMap((settledResult: ProjectSummaryResult): ProjectSummary[] => {
      if (settledResult.value) {
        return [settledResult.value];
      } else {
        return [];
      }
    });
  }

  /** Get a summary of a project
   *
   * @param id id of the project
   */
  public async getProjectSummary(id: string): Promise<ProjectSummary> {
    const project = await this.model.findOne({ id }).collation(ProjectIdCollation);

    if (!project) {
      throw new NotFoundException(`Project with id '${id}' could not be found.`);
    }

    const updated = project.updated.toISOString();
    const cacheKey = `Project:Summary:${id}:${updated}:${SimulationRunService.summaryVersion}`;
    return this.getWithCache<ProjectSummary>(cacheKey, this._getProjectSummary.bind(this, project), 0);
  }

  private async _getProjectSummary(project: ProjectModel): Promise<ProjectSummary> {
    const ownerAuth0Id = project?.owner;
    let owner: Account | undefined;
    if (ownerAuth0Id) {
      owner = await this.getAccount(ownerAuth0Id);
    }

    return {
      id: project.id,
      simulationRun: await this.simulationRunService.getRunSummary(project.simulationRun, true),
      owner: owner,
      created: project.created.toISOString(),
      updated: project.updated.toISOString(),
    };
  }

  /** Check if a project is valid
   *
   * @param projectInput project
   * @param validateSimulationResultsData whether to validate the data for each SED-ML report
   *                                      and plot of each SED-ML document
   */
  public async validateProject(
    projectInput: ProjectInput,
    validateSimulationResultsData = false,
    validateIdAvailable = false,
    validateSimulationRunNotPublished = false,
  ): Promise<void> {
    const errors: string[] = [];

    if (validateIdAvailable) {
      const numProjects = await this.model.findOne({ id: projectInput.id }).collation(ProjectIdCollation).count();
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
          `Simulation run '${projectInput.simulationRun}' has already been published as project '${project.id}'.
          Each run can only be published once.`,
        );
      }
    }

    try {
      await this.simulationRunValidationService.validateRun(projectInput.simulationRun, validateSimulationResultsData);
    } catch (error) {
      const message =
        error instanceof BiosimulationsException && error.message ? error.message : 'Error validating run';
      errors.push(message);
    }

    const project = new this.model(projectInput);
    try {
      await project.validate();
    } catch (error) {
      errors.push(error instanceof Error && error.message ? error.message : 'Validation of project failed');
    }

    if (errors.length) {
      throw new BiosimulationsException(HttpStatus.BAD_REQUEST, 'Project is invalid', errors.join('\n\n'));
    }
  }
  private getOwner(projectInput: ProjectInput, user: AuthToken): string | undefined {
    if (projectInput?.owner) {
      if (user?.permissions?.includes(scopes.projects.proxyOwnership.id)) {
        return projectInput.owner;
      } else {
        throw new ForbiddenException('Only administrators can submit projects on behalf of other accounts.');
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

  private static accountVersion = 1;

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
        organizationIds.map((organizationId: string): Promise<Auth0Organization> => {
          return this.accountManagementService.getOrganization(organizationIds);
        }),
      );
    } else {
      type = AccountType.user;
      const user = await this.accountManagementService.getUser(auth0Id);
      id = user?.user_metadata?.username as string;
      name = user?.name as string;
      url = user?.user_metadata?.url;

      organizationsDetails = await this.accountManagementService.getUserOrganizations(auth0Id);
    }
    const organizations = organizationsDetails.map((organization: Auth0Organization): Organization => {
      return {
        id: organization.name,
        name: organization?.display_name || organization.name,
        url: organization?.metadata?.url,
      };
    });

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
    const cacheKey = `Account:info:${auth0Id}:${ProjectsService.accountVersion}`;
    return this.getWithCache<Account>(cacheKey, this._getAccount.bind(this, auth0Id));
  }

  private async getWithCache<T>(
    key: string,
    valueFunc: () => Promise<T>,
    ttl = 60 * 24,
    overwrite = false,
  ): Promise<T> {
    const cachedValue = overwrite ? null : ((await this.cacheManager.get(key)) as T | null);

    if (cachedValue != null) {
      return cachedValue;
    } else {
      const value = await valueFunc();
      await this.cacheManager.set(key, value, ttl); // 1 day; to enable users and organizations to change their names
      return value;
    }
  }
}
