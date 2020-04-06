import { Injectable } from '@nestjs/common';
import { ResourceService } from '../base/resource.service';
import { ProjectDTO } from '@biosimulations/datamodel/core';

@Injectable()
export class ProjectsService extends ResourceService<ProjectDTO> {}
