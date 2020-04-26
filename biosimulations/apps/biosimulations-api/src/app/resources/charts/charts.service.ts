import { Injectable } from '@nestjs/common';
import { ResourceService } from '../base/resource.service';

type chart = any;
@Injectable()
export class ChartsService extends ResourceService<any> {}
