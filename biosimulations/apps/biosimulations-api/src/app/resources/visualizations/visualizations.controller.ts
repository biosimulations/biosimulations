import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResourceController } from '../base/resource.controller';
import { VisualizationDTO } from '@biosimulations/datamodel/core';
import { VisualizationsService } from './visualizations.service';

@ApiTags('Visualizations')
@Controller('visualizations')
export class VisualizationsController extends ResourceController<
  VisualizationDTO
> {
  constructor(service: VisualizationsService) {
    super(service, 'Visualizations');
  }
}
