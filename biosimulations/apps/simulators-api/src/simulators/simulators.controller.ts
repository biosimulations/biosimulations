import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { Simulator } from './simulator.model';
import { SimulatorsService } from './simulators.service';
@ApiTags('Simulators')
@Controller('simulators')
export class SimulatorsController {
  constructor(private service: SimulatorsService) {}
  @Get()
  getSimulators() {
    return this.service.findAll();
  }

  @Get(':id')
  getSimulator() {
    return null;
  }

  @Post()
  async create(@Body() doc: Simulator) {
    return this.service.new(doc);
  }
}
