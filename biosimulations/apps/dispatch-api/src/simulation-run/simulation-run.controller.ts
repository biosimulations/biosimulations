import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { fstat } from 'fs';
import { SimulationRun, SimulationUpload } from './simulation-run.dto';
import { SimulationRunService } from './simulation-run.service';

@ApiTags('Simulation Runs')
@Controller('run')
export class SimulationRunController {
  constructor(private service: SimulationRunService) {}
  @Get()
  getRuns() {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: SimulationUpload })
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  createRun(@Body() run: SimulationRun, @UploadedFile() file: any) {
    return this.service.createRun(run, file);
  }

  @Get(':id')
  getRun() {}

  @Put(':id')
  modfiyRun() {}
}
