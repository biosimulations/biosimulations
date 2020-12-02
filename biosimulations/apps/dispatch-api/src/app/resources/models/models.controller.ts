import { DispatchSimulationModelDB } from '@biosimulations/dispatch/api-models';
import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ModelsService } from './models.service';
@ApiTags('Database')
@Controller()
export class ModelsController {
  constructor(private modelsService: ModelsService) {}

  @Post('/jobinfo')
  @ApiOperation({
    summary: 'Fetches job information from Database',
    deprecated: true,
  })
  @ApiCreatedResponse({
    status: 200,
    description: 'Data fetched successfully',
    type: Object,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'No data found',
    type: Object,
  })
  @ApiResponse({
    status: 200,
    description: 'Fetch all simulation information',
    type: Object,
  })
  async getJobInfo(@Body() listUid: string[]): Promise<any> {
    return {
      data: await this.modelsService.getData(listUid),
    };
  }
}
