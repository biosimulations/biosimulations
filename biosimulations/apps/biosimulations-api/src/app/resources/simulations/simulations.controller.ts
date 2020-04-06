import { Controller } from '@nestjs/common';
import { ResourceController } from '../base/resource.controller';
import { SimualtionDTO } from '@biosimulations/datamodel/core';
import { SimulationsService } from './simulations.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Simulations')
@Controller('simulations')
export class SimulationsController extends ResourceController<SimualtionDTO> {
  constructor(service: SimulationsService) {
    super(service, 'Simulations');
  }
}
