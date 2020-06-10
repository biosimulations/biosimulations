import { Controller, Get, Put, Body, Param, Post, Query } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ModelsService } from './models.service';
import { CreateBiomodelDTO } from './biomodel.dto';

@ApiTags('Models')
@Controller('models')
export class ModelsController {
  constructor(public service: ModelsService) {}

  @Post()
  create(@Body() body: CreateBiomodelDTO) {}
}
