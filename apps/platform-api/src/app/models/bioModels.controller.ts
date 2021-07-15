import {
  Body,
  Controller,
  Param,
  Post,
  Req,
  VERSION_NEUTRAL,
} from '@nestjs/common';

import { ApiBody, ApiExtraModels, ApiProperty, ApiTags } from '@nestjs/swagger';
import { PublishBioModelInput, BioModel } from './bioModel.model';

@ApiTags('Models')
@Controller({ path: 'models', version: VERSION_NEUTRAL })
export class BioModelsController {
  @ApiBody({ type: PublishBioModelInput })
  @Post()
  public makeModel(@Body() body: PublishBioModelInput): BioModel {
    const id = 'test';
    const model: BioModel = {
      simulationRun: body.simulationRun,
      id,
    };
    return model;
  }
}
