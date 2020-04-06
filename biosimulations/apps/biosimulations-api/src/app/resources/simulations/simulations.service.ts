import { Injectable } from '@nestjs/common';
import { ResourceService } from '../base/resource.service';
import { SimualtionDTO } from '@biosimulations/datamodel/core';

@Injectable()
export class SimulationsService extends ResourceService<SimualtionDTO> {}
