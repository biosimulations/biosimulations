import { Controller } from '@nestjs/common';
import { ResourceController } from '../base/resource.controller';
import { ChartTypeDTO } from '@biosimulations/datamodel/core';
import { ApiTags } from '@nestjs/swagger';
import { ChartsService } from './charts.service';

@ApiTags('Charts')
@Controller('charts')
export class ChartsController extends ResourceController<ChartTypeDTO> {
  constructor(service: ChartsService) {
    super(service, 'Chart');
  }
}
