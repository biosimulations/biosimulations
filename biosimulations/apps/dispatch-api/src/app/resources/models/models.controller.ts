import { DispatchSimulationModelDB } from '@biosimulations/dispatch/api-models';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ModelsService } from './models.service';

@Controller()
export class ModelsController {
  constructor(private modelsService: ModelsService) {}

  // Note: Temp route to test DB linkage
  @Post('db-save')
  @ApiOperation({
    summary: 'Save to DB',
  })
  @ApiResponse({
    status: 200,
    description: 'Temp route to test DB linkage',
    type: Object,
  })
  dbSave(@Body() model: DispatchSimulationModelDB): {} {
    this.modelsService.createNewDispatchSimulationModel(model);
    return {
      message: 'OK',
    };
  }
}
