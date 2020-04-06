import { Injectable } from '@nestjs/common';
import { ResourceService } from '../base/resource.service';
import { ChartTypeDTO } from '@biosimulations/datamodel/core';

@Injectable()
export class ChartsService extends ResourceService<ChartTypeDTO> {}
