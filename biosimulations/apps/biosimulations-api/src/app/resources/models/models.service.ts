import { Injectable } from '@nestjs/common';
import { ResourceService } from '../base/resource.service';
import { ModelDTO } from '@biosimulations/datamodel/core';

@Injectable()
export class ModelsService extends ResourceService<ModelDTO> {}
