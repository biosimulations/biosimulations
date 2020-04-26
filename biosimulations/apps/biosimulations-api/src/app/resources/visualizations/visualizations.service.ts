import { Injectable } from '@nestjs/common';
import { ResourceService } from '../base/resource.service';

@Injectable()
export class VisualizationsService extends ResourceService<any> {}
