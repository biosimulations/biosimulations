import { permissions, OptionalAuth } from '@biosimulations/auth/nest';
import {
  Project,
  ProjectInput,
  ProjectSummary,
} from '@biosimulations/datamodel/api';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
  Put,
  Query,
  Req,
  HttpCode,
} from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiBody,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiPayloadTooLargeResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { ProjectId, ProjectIdParam } from './id.decorator';
import { ProjectModel } from './project.model';
import { ProjectsService } from './projects.service';
import { ErrorResponseDocument } from '@biosimulations/datamodel/api';
import { Request } from 'express';
import { AuthToken } from '@biosimulations/auth/common';

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
  public async getProjects(): Promise<Project[]> {
    const projects = await this.service.getProjects();
    return projects.map((proj) => this.returnProject(proj));
  }

  @Get('summary')
  @ApiOperation({
    summary: 'Get a summary of each published projects',
    description: 'Get a list of summaries of each published project',
  })
  @ApiOkResponse({
    description: 'List of information about each published project',
    type: [ProjectSummary],
  })
  public async getProjectSummaries(): Promise<ProjectSummary[]> {
    return this.service.getProjectSummaries();
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
  @ProjectIdParam()
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
    @ProjectId('projectId') projectId: string,
  ): Promise<ProjectSummary> {
    return this.service.getProjectSummary(projectId);
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
      'The project could not be saved because another project already has the same id or simulation run. The `PUT` method can be used to modify projects.',
  })
  @ApiCreatedResponse({
    description: 'The simulation run was successfully published',
    type: Project,
  })
  @OptionalAuth()
  public async createProject(
    @Body() project: ProjectInput,
    @Req() req: Request,
  ): Promise<Project> {
    const user = req?.user as AuthToken;
    const proj = await this.service.createProject(project, user);
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
  @ApiUnauthorizedResponse({
    type: ErrorResponseDocument,
    description: 'A valid authorization was not provided',
  })
  @ApiForbiddenResponse({
    type: ErrorResponseDocument,
    description:
      'The account does not have permission to modify the requested project',
  })
  @permissions()
  @ApiConflictResponse({
    type: ErrorResponseDocument,
    description:
      'The project could not be saved because another project already has the same id or simulation run.',
  })
  @ApiOkResponse({
    description:
      'The information about the publication of the simulation run was successfully updated',
    type: Project,
  })
  @ProjectIdParam()
  public async updateProject(
    @ProjectId('projectId') projectId: string,
    @Body() project: ProjectInput,
    @Req() req: Request,
  ): Promise<Project> {
    const user = req?.user as AuthToken;
    const proj = await this.service.updateProject(projectId, project, user);
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
    summary: 'Validate a project for publication',
    description:
      'Check whether a project is valid for publication (e.g, succeeded and provides the [minimum required metadata](https://biosimulators.org/conventions/metadata). Returns 204 (No Content) for a publishable run, or a 400 (Bad Input) for a run that cannot be published. 400 errors include diagnostic information which describe why the run cannot be published.',
  })
  @ApiQuery({
    name: 'validateSimulationResultsData',
    description:
      'Whether to validate the data (e.g., numerical simulation results) for each SED-ML report and plot for each SED-ML document. Default: false.',
    required: false,
    type: Boolean,
  })
  @ApiBody({
    description: 'Information about the project.',
    type: ProjectInput,
  })
  @ApiPayloadTooLargeResponse({
    type: ErrorResponseDocument,
    description:
      'The payload is too large. The payload must be less than the server limit.',
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDocument,
    description: 'The project is not valid.',
  })
  @ApiNoContentResponse({
    description: 'The project is valid.',
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
