import { Body, Controller, Post, VERSION_NEUTRAL } from '@nestjs/common';

import { ApiBody, ApiTags } from '@nestjs/swagger';
import { PublishProjectInput, BioModel } from './projects.model';

@ApiTags('Models')
@Controller({ path: 'models', version: VERSION_NEUTRAL })
export class ProjectsController {
  @ApiBody({ type: PublishProjectInput })
  @Post()
  public makeModel(@Body() body: PublishProjectInput): BioModel {
    const id = 'test';
    const model: BioModel = {
      simulationRun: body.simulationRun,
      id,
    };
    return model;
  }
}
