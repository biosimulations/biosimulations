import { Controller } from '@nestjs/common';
import { ResourceController } from '../base/resource.controller';

import { ProjectsService } from './projects.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController extends ResourceController<any> {
  constructor(service: ProjectsService) {
    super(service, 'Projects');
  }
}
