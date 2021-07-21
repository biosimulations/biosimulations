import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  VERSION_NEUTRAL,
} from '@nestjs/common';

import { ApiBody, ApiTags } from '@nestjs/swagger';

import { PublishProjectInput, Project } from '@biosimulations/datamodel/api';
import { ProjectsService } from './projects.service';

@ApiTags('Projects')
@Controller({ path: 'projects', version: VERSION_NEUTRAL })
export class ProjectsController {
  public constructor(private service: ProjectsService) {}

  @ApiBody({ type: PublishProjectInput })
  @Post()
  public makeProject(@Body() body: PublishProjectInput): Project {
    const project = this.service.saveProject(body);
    return project;
  }

  @Get()
  public getProjects(): Project[] {
    const projects = this.service.getProjects();
    return projects;
  }

  @Get(':id')
  public getProject(@Param('id') id: string): Project {
    const project = this.service.getProject(id);
    return project;
  }
}
