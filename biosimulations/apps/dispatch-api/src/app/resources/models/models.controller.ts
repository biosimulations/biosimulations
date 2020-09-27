import { DispatchSimulationModelDB } from '@biosimulations/dispatch/api-models';
import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ModelsService } from './models.service';
@ApiTags('Database')
@Controller()
export class ModelsController {
  constructor(private modelsService: ModelsService) {}

  // Note: Temp route to test DB linkage

  @Post('db-save')
  @ApiConsumes('application/json')
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

  @Post('/jobinfo')
  @ApiOperation({ summary: 'Fetches job information from Database' })
  @ApiResponse({
    status: 200,
    description: 'Fetch all simulation information',
    type: Object,
  })
  async getJobInfo(@Body() listUid: string[]): Promise<{}> {
    return {
      message: 'Data fetched successfully',
      data: await this.modelsService.getData(listUid),
    };
  }
}
