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
import { CreateBiomodelDTO } from './biomodel.dto';
import {
  JwtGuard,
  AdminGuard,
} from '@biosimulations/shared/biosimulations-auth';
@ApiTags('Models')
@Controller('models')
export class ModelsController {
  constructor(public service: ModelsService) {}
  @Get()
  async getAll() {
    return await this.service.search();
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
