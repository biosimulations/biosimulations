import { Controller, Get, Param, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiBody, ApiQuery, ApiParam } from '@nestjs/swagger';
import { Simulator } from '@biosimulations/simulators/api-models';
import { SimulatorsService } from './simulators.service';
import { version } from 'process';
@ApiTags('Simulators')
@Controller('simulators')
export class SimulatorsController {
  constructor(private service: SimulatorsService) {}
  @Get()
  getSimulators() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
  })
  @ApiQuery({
    name: 'version',
    required: false,
    type: String,
  })
  getSimulator(@Param('id') id: string, @Query('version') version: string) {
    return null;
  }

  @Post()
  @ApiBody({
    type: Simulator,
  })
  async create(@Body() doc: Simulator) {
    return this.service.new(doc);
  }
}
