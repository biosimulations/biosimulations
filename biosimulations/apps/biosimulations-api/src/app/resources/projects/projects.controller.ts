import { Controller } from '@nestjs/common';
import { ResourceController } from '../base/resource.controller';
import { ChartTypeDTO, ProjectDTO } from '@biosimulations/datamodel/core';
import { ProjectsService } from './projects.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController extends ResourceController<ProjectDTO> {
  constructor(service: ProjectsService) {
    super(service, 'Projects');
  }
}
