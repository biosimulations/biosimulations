import { Controller } from '@nestjs/common';
import { ResourceController } from '../base/resource.controller';

import { SimulationsService } from './simulations.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Simulations')
@Controller('simulations')
export class SimulationsController extends ResourceController<any> {
  constructor(service: SimulationsService) {
    super(service, 'Simulations');
  }
}
