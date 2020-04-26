import { Injectable } from '@nestjs/common';
import { ResourceService } from '../base/resource.service';

@Injectable()
export class SimulationsService extends ResourceService<any> {}
