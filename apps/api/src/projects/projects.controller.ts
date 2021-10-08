import { permissions } from '@biosimulations/auth/nest';
import { Project, ProjectInput } from '@biosimulations/datamodel/api';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiNoContentResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { ProjectId, ProjectIdParam } from './id.decorator';
import { ProjectModel } from './project.model';
import { ProjectsService } from './projects.service';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  public constructor(private service: ProjectsService) {}

  @Get()
  public async getProjects(): Promise<Project[]> {
    const projects = await this.service.getProjects();
    if (projects.length > 0) {
      return projects.map((proj) => this.returnProject(proj));
    }
    throw new NotFoundException('No Projects Found');
  }

  @Get(':id')
  @ProjectIdParam()
  public async getProject(@ProjectId('id') id: string): Promise<Project> {
    const proj = await this.service.getProject(id);

    if (proj) {
      return this.returnProject(proj);
    }
    throw new NotFoundException(`Project with id ${id} not found`);
  }

  @Post()
  @permissions('create:Projects')
  public async createProject(@Body() project: ProjectInput): Promise<Project> {
    const proj = await this.service.createProject(project);
    return this.returnProject(proj);
  }

  @Put(':id')
  @permissions('update:Projects')
  @ProjectIdParam()
  public async updateProject(
    @ProjectId('id') projectId: string,
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
  @permissions('delete:Projects')
  public async deleteProjects(): Promise<void> {
    return await this.service.deleteProjects();
  }

  @ApiNoContentResponse()
  @Delete(':id')
  @permissions('delete:Projects')
  @ProjectIdParam()
  public async deleteProject(@ProjectId('id') id: string): Promise<void> {
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
