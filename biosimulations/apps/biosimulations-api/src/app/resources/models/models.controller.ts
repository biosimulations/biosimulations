import { Controller, Get, Put, Body, Param, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AlgorithmDTO, ModelDTO } from '@biosimulations/datamodel/core';
import { ModelsService } from './models.service';
import { ResourceController } from '../base/resource.controller';
@ApiTags('Models')
@Controller('models')
export class ModelsController extends ResourceController<ModelDTO> {
  constructor(service: ModelsService) {
    super(service, 'Models');
  }
}
