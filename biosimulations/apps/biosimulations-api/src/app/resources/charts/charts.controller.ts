import { Controller } from '@nestjs/common';
import { ResourceController } from '../base/resource.controller';

import { ApiTags } from '@nestjs/swagger';
import { ChartsService } from './charts.service';

@ApiTags('Charts')
@Controller('charts')
export class ChartsController extends ResourceController<any> {
  constructor(service: ChartsService) {
    super(service, 'Chart');
  }
}
