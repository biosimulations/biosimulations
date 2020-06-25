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
import {
  ApiBody,
  ApiTags,
  ApiOAuth2,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiGoneResponse,
} from '@nestjs/swagger';
import { ModelsService } from './models.service';

import {
  ModelResource,
  ModelsDocument,
  ModelDocument,
  CreateModelDocument,
} from '@biosimulations/datamodel/api';
import {
  JwtGuard,
  AdminGuard,
} from '@biosimulations/shared/biosimulations-auth';

import { BiomodelDB } from './biomodel.model';

const dbToApi = (dbModel: BiomodelDB): ModelResource => {
  const returnModel = new ModelResource(
    dbModel.id,
    dbModel.attributes,
    {
      owner: dbModel.owner,
      file: dbModel.file,
      image: dbModel.image,
      parent: dbModel.parent,
    },
    {
      created: dbModel.created,
      updated: dbModel.updated,
      version: dbModel.version,
    },
  );

  return returnModel;
};
@ApiTags('Models')
@Controller('models')
export class ModelsController {
  constructor(public service: ModelsService) {}
  @ApiOkResponse({
    description: 'Found models.',
    type: ModelsDocument,
  })
  @Get()
  async getAll(): Promise<ModelsDocument> {
    const models = await this.service.search();
    if (models) {
      return { data: models.map(dbToApi) };
    } else {
      return { data: [] };
    }
  }

  @ApiOkResponse({
    description: 'Found model.',
    type: ModelDocument,
  })
  @Get(':id')
  async getOne(@Param('id') id: string): Promise<ModelDocument | undefined> {
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
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: ModelResource,
  })
  @Post()
  async create(@Body() body: CreateModelDocument) {
    return this.service.createNewBiomodel(body.data);
  }

  @UseGuards(AdminGuard)
  @Delete()
  async deleteAll() {
    this.service.deleteAll();
  }
}
