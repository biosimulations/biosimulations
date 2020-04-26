import { Controller, Get, Put, Body, Param, Post, Query } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ModelsService } from './models.service';
import { ResourceController } from '../base/resource.controller';
@ApiTags('Models')
@Controller('models')
export class ModelsController extends ResourceController<any> {
  constructor(service: ModelsService) {
    super(service, 'Models');
  }
  @Get()
  search(@Query('test333') param?: string) {
    return param;
  }
}
