import { Injectable } from '@nestjs/common';
import { ResourceService } from '../base/resource.service';
import { VisualizationDTO } from '@biosimulations/datamodel/core';

@Injectable()
export class VisualizationsService extends ResourceService<VisualizationDTO> {}
