import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  Post,
  Query,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiTags, ApiOAuth2 } from '@nestjs/swagger';
import { ModelsService } from './models.service';
import { CreateBiomodelDTO, Model, ModelResource } from './biomodel.dto';
import {
  JwtGuard,
  AdminGuard,
} from '@biosimulations/shared/biosimulations-auth';

import { BiomodelDB } from './biomodel.model';

const dbToApi = (dbModel: BiomodelDB): ModelResource => {
  const returnModel = new ModelResource(dbModel.id, dbModel.attributes, 'test');

  return returnModel;
};
@ApiTags('Models')
@Controller('models')
export class ModelsController {
  constructor(public service: ModelsService) {}
  @Get()
  async getAll(): Promise<ModelResource[] | undefined> {
    const models = await this.service.search();

    return models?.map(dbToApi);
  }

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<Model | undefined> {
    const dbModel = await this.service.get(id);

    if (dbModel) {
      const returnModel = dbToApi(dbModel);
      const response = {
        data: returnModel,
      };
      return response;
    }
  }

  @UseGuards(JwtGuard)
  @ApiOAuth2([])
  @Post()
  async create(@Body() body: CreateBiomodelDTO) {
    return this.service.createNewBiomodel(body.data);
  }

  @UseGuards(AdminGuard)
  @Delete()
  async deleteAll() {
    this.service.deleteAll();
  }
}
