import { permissions } from '@biosimulations/auth/nest';
import { Project, ProjectInput } from '@biosimulations/datamodel/api';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiPayloadTooLargeResponse,
} from '@nestjs/swagger';
import { ProjectId, ProjectIdParam } from './id.decorator';
import { ProjectModel } from './project.model';
import { ProjectsService } from './projects.service';
import { ErrorResponseDocument } from '@biosimulations/datamodel/api';

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
    description: 'The payload is too large. The payload must be less than the server limit.',
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
    description: 'The payload is too large. The payload must be less than the server limit.',
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

  @ApiNoContentResponse({ description: 'Projects deleted' })
  @Delete()
  @ApiOperation({
    summary: 'Delete all published projects',
    description: 'Delete all published projects',
  })
  @ApiNoContentResponse({
    description: 'All published projects were successfully deleted',
  })
  @permissions('delete:Projects')
  public async deleteProjects(): Promise<void> {
    return this.service.deleteProjects();
  }

  @Delete(':projectId')
  @ApiOperation({
    summary: 'Delete a published project',
    description: 'Delete a published project',
  })
  @ApiNoContentResponse({
    description: 'The project was successfully deleted',
  })
  @permissions('delete:Projects')
  @ProjectIdParam()
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
}
