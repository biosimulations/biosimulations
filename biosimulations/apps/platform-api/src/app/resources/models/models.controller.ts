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
  Req,
  CacheInterceptor,
  UseInterceptors,
  CacheTTL,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiBody,
  ApiTags,
  ApiOAuth2,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiGoneResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ModelsService } from './models.service';

import {
  ModelResource,
  ModelsDocument,
  ModelDocument,
  CreateModelDocument,
} from '@biosimulations/platform/api-models';
import { JwtGuard, AdminGuard } from '@biosimulations/auth/nest';
import { AuthToken } from '@biosimulations/auth/common';
import { Request } from 'express';
import { Model } from './biomodel.model';

const dbToApi = (dbModel: Model): ModelResource => {
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
@UseInterceptors(CacheInterceptor)
@ApiTags('Models')
@Controller('models')
export class ModelsController {
  constructor(public service: ModelsService) {}
  @ApiOkResponse({
    description: 'Found models.',
    type: ModelsDocument,
  })
  @CacheTTL(3600)
  @Get()
  async getAll(): Promise<ModelsDocument> {
    const result = this.service.search().then((models: Model[] | null) => {
      if (models) {
        const response = models.map(dbToApi);
        return { data: response };
      } else {
        return { data: [] };
      }
    });
    return result;
  }

  @ApiOkResponse({
    description: 'Found model.',
    type: ModelDocument,
  })
  @ApiNotFoundResponse({
    description: 'Could not find model with the given id',
  })
  @Get(':id')
  async getOne(@Param('id') id: string): Promise<ModelDocument | undefined> {
    const dbModel = await this.service.get(id);
    if (!dbModel) {
      throw new NotFoundException('Model with id ' + id + ' not found');
    }
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
  async create(
    @Req() req: Request,
    @Body() body: CreateModelDocument,
  ): Promise<ModelDocument> {
    const user: AuthToken = req.user as any;
    const data = body.data;
    data.relationships.owner.data.id =
      user['https://biosimulations.org/user_metadata'].username;
    const model = await this.service.createNewBiomodel(data);
    return { data: dbToApi(model.toObject()) };
  }

  @UseGuards(AdminGuard)
  @ApiOAuth2([])
  @Delete()
  async deleteAll() {
    this.service.deleteAll();
  }
}
