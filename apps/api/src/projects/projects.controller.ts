import { permissions } from '@biosimulations/auth/nest';
import {
  Project,
  ProjectInput,
  ProjectSummary,
  SimulationRunSummary,
  ProjectMetadataSummary,
} from '@biosimulations/datamodel/api';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
  Put,
  Param,
  Query,
  HttpCode,
} from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiPayloadTooLargeResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { ProjectId, ProjectIdParam } from './id.decorator';
import { ProjectModel } from './project.model';
import { ProjectsService } from './projects.service';
import { ErrorResponseDocument } from '@biosimulations/datamodel/api';
import { SimulationRunMetadataModel } from '../metadata/metadata.model';
import { SimulationRunMetadata } from '@biosimulations/datamodel/api';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  public constructor(private service: ProjectsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get a list of the published projects',
    description: 'Get a list of information about each published project',
  })
  @ApiOkResponse({
    description: 'List of information about each published project',
    type: [Project],
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDocument,
    description: 'No projects have been published',
  })
  public async getProjects(): Promise<Project[]> {
    const projects = await this.service.getProjects();
    if (projects.length > 0) {
      return projects.map((proj) => this.returnProject(proj));
    }
    throw new NotFoundException('No Projects Found');
  }

  @Get(':projectId')
  @ApiOperation({
    summary: 'Get a published project',
    description: 'Get information about a published project',
  })
  @ApiOkResponse({
    description: 'Information about the project',
    type: Project,
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDocument,
    description: 'No project has the requested id',
  })
  @ProjectIdParam()
  public async getProject(
    @ProjectId('projectId') projectId: string,
  ): Promise<Project> {
    const proj = await this.service.getProject(projectId);

    if (proj) {
      return this.returnProject(proj);
    }
    throw new NotFoundException(`Project with id ${projectId} not found`);
  }

  @ApiOperation({
    summary: 'Get a summary of a project',
    description: 'Returns a summary of the project',
  })
  @ApiParam({
    name: 'projectId',
    description: 'Id of the project',
    required: true,
    type: String,
  })
  @ApiOkResponse({
    description: 'A summary of the project was successfully retrieved',
    type: ProjectSummary,
  })
  @ApiNotFoundResponse({
    description: 'No project could be found with requested id',
    type: ErrorResponseDocument,
  })
  @Get(':projectId/summary')
  public async getProjectSummary(
    @Param('projectId') projectId: string,
  ): Promise<ProjectSummary> {
    const summary = await this.service.getProjectSummary(projectId);
    return summary;
  }

  @Post()
  @ApiOperation({
    summary: 'Publish a simulation run',
    description: 'Publish a simulation run',
  })
  @ApiBody({
    description: 'Information about the simulation run to publish',
    type: ProjectInput,
  })
  @ApiPayloadTooLargeResponse({
    type: ErrorResponseDocument,
    description:
      'The payload is too large. The payload must be less than the server limit.',
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDocument,
    description:
      "The simulation run is not valid for publication (e.g., run didn't succeed or metadata doesn't meet minimum requirements)",
  })
  @ApiConflictResponse({
    type: ErrorResponseDocument,
    description:
      'The project could not be saved because another project already has the same id. The `PUT` method can be used to modify projects.',
  })
  @ApiCreatedResponse({
    description: 'The simulation run was successfully published',
    type: Project,
  })
  @permissions('create:Projects')
  public async createProject(@Body() project: ProjectInput): Promise<Project> {
    const proj = await this.service.createProject(project);
    return this.returnProject(proj);
  }

  @Put(':projectId')
  @ApiOperation({
    summary: 'Update a published simulation run',
    description: 'Update a published simulation run',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDocument,
    description: 'No project has the requested id',
  })
  @ApiBody({
    description:
      'Updated information about the publication of the simulation run',
    type: ProjectInput,
  })
  @ApiPayloadTooLargeResponse({
    type: ErrorResponseDocument,
    description:
      'The payload is too large. The payload must be less than the server limit.',
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDocument,
    description:
      "The simulation run is not valid for publication (e.g., run didn't succeed or metadata doesn't meet minimum requirements)",
  })
  @ApiOkResponse({
    description:
      'The information about the publication of the simulation run was successfully updated',
    type: Project,
  })
  @permissions('update:Projects')
  @ProjectIdParam()
  public async updateProject(
    @ProjectId('projectId') projectId: string,
    @Body() project: ProjectInput,
  ): Promise<Project> {
    const proj = await this.service.updateProject(projectId, project);
    if (proj) {
      return this.returnProject(proj);
    }
    throw new NotFoundException(`Project with id ${projectId} not found`);
  }

  @Delete()
  @ApiOperation({
    summary: 'Delete all published projects',
    description: 'Delete all published projects',
  })
  @ApiNoContentResponse({
    description: 'All published projects were successfully deleted',
  })
  @permissions('delete:Projects')
  @HttpCode(204)
  public async deleteProjects(): Promise<void> {
    return this.service.deleteProjects();
  }

  @Delete(':projectId')
  @ApiOperation({
    summary: 'Delete a published project',
    description: 'Delete a published project',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDocument,
    description: 'No project has the requested id',
  })
  @ApiNoContentResponse({
    description: 'The project was successfully deleted',
  })
  @permissions('delete:Projects')
  @ProjectIdParam()
  @HttpCode(204)
  public async deleteProject(
    @ProjectId('projectId') projectId: string,
  ): Promise<void> {
    const res = await this.service.deleteProject(projectId);
    return res;
  }

  private returnProject(projectModel: ProjectModel): Project {
    const project: Project = {
      id: projectModel.id,
      simulationRun: projectModel.simulationRun,
      created: projectModel.created,
      updated: projectModel.updated,
    };

    return project;
  }

  @Post('validate')
  @ApiOperation({
    summary: 'Validate a simulation run for publication',
    description:
      'Check whether a simulation is valid for publication (e.g, succeeded and provides the [minimum required metadata](https://biosimulators.org/conventions/metadata). Returns 204 (No Content) for a publishable run, or a 400 (Bad Input) for a run that cannot be published. 400 errors include diagnostic information which describe why the run cannot be published.',
  })
  @ApiQuery({
    name: 'validateSimulationResultsData',
    description:
      'Whether to validate the data (e.g., numerical simulation results) for each SED-ML report and plot for each SED-ML document. Default: false.',
    required: false,
    type: Boolean,
  })
  @ApiBody({
    description: 'Information about the simulation run to publish.',
    type: ProjectInput,
  })
  @ApiPayloadTooLargeResponse({
    type: ErrorResponseDocument,
    description:
      'The payload is too large. The payload must be less than the server limit.',
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDocument,
    description: 'The simulation run cannot be published.',
  })
  @ApiNoContentResponse({
    description: 'The simulation run is valid for publication.',
  })
  @HttpCode(204)
  public async validateProject(
    @Body() projectInput: ProjectInput,
    @Query('validateSimulationResultsData')
    validateSimulationResultsData = 'false',
  ): Promise<void> {
    await this.service.validateProject(
      projectInput,
      validateSimulationResultsData == 'true',
    );
    return;
  }
}
