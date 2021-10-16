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
  ApiParam,
  ApiBody,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { ProjectId, ProjectIdParam } from './id.decorator';
import { ProjectModel } from './project.model';
import { ProjectsService } from './projects.service';
import { ErrorResponseDocument } from '@biosimulations/datamodel/api';

@ApiTags('Published projects')
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
  @ApiParam({
    name: 'projectId',
    description: 'Id of the project',
    required: true,
    type: String,
  })
  @ApiOkResponse({
    description: 'Onformation about the project',
    type: Project,
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDocument,
    description: 'No project has the requested id',
  })
  @ProjectIdParam()
  public async getProject(
    @ProjectId('projectId') id: string,
  ): Promise<Project> {
    const proj = await this.service.getProject(id);

    if (proj) {
      return this.returnProject(proj);
    }
    throw new NotFoundException(`Project with id ${id} not found`);
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
  @ApiCreatedResponse({
    description: 'The simulation run was successfully published',
    type: Project,
  })
  @permissions('create:Projects')
  @ApiUnauthorizedResponse({
    type: ErrorResponseDocument,
    description: 'A valid authorization was not provided',
  })
  @ApiForbiddenResponse({
    type: ErrorResponseDocument,
    description: 'This account does not have permission to publish projects',
  })
  public async createProject(@Body() project: ProjectInput): Promise<Project> {
    const proj = await this.service.createProject(project);
    return this.returnProject(proj);
  }

  @Put(':projectId')
  @ApiOperation({
    summary: 'Update a published simulation run',
    description: 'Update a published simulation run',
  })
  @ApiParam({
    name: 'projectId',
    description: 'Id of the project',
    required: true,
    type: String,
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
  @ApiOkResponse({
    description:
      'The information about the publication of the simulation run was successfully updated',
    type: Project,
  })
  @permissions('update:Projects')
  @ApiUnauthorizedResponse({
    type: ErrorResponseDocument,
    description: 'A valid authorization was not provided',
  })
  @ApiForbiddenResponse({
    type: ErrorResponseDocument,
    description: 'This account does not have permission to modify projects',
  })
  @ProjectIdParam()
  public async updateProject(
    @ProjectId('projectId') id: string,
    @Body() project: ProjectInput,
  ): Promise<Project> {
    const proj = await this.service.updateProject(id, project);
    if (proj) {
      return this.returnProject(proj);
    }
    throw new NotFoundException(`Project with id ${id} not found`);
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
  @ApiUnauthorizedResponse({
    type: ErrorResponseDocument,
    description: 'A valid authorization was not provided',
  })
  @ApiForbiddenResponse({
    type: ErrorResponseDocument,
    description: 'This account does not have permission to delete projects',
  })
  public async deleteProjects(): Promise<void> {
    return this.service.deleteProjects();
  }

  @ApiNoContentResponse()
  @Delete(':projectId')
  @ApiOperation({
    summary: 'Delete a published project',
    description: 'Delete a published project',
  })
  @ApiParam({
    name: 'projectId',
    description: 'Id of the project',
    required: true,
    type: String,
  })
  @ApiNoContentResponse({
    description: 'The project was successfully deleted',
  })
  @permissions('delete:Projects')
  @ApiUnauthorizedResponse({
    type: ErrorResponseDocument,
    description: 'A valid authorization was not provided',
  })
  @ApiForbiddenResponse({
    type: ErrorResponseDocument,
    description: 'This account does not have permission to delete projects',
  })
  @ProjectIdParam()
  public async deleteProject(
    @ProjectId('projectId') id: string,
  ): Promise<void> {
    const res = await this.service.deleteProject(id);
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
