import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  VERSION_NEUTRAL,
} from '@nestjs/common';

import { ApiBody,  ApiTags } from '@nestjs/swagger';

import {  SimulationRunMetadata, SimulationRunMetadataInput } from '@biosimulations/datamodel/api';
import { MetadataService } from './metadata.service';

@ApiTags('Metadata')
@Controller({ path: 'metadata', version: VERSION_NEUTRAL })
export class MetadataController {
  public constructor(private service: MetadataService) {}

  @ApiBody({ type: SimulationRunMetadataInput })
  @Post()
  public makeMetadata(
    @Body() body: SimulationRunMetadataInput,
  ): SimulationRunMetadata {
    const metadata = this.service.createMetadata(body);
    return metadata;
  }

  @Get()
  public getAllMetadata(): SimulationRunMetadata[] {
    const metadata = this.service.getAllMetadata();
    return metadata;
  }

  @Get(':id')
  public getMetadata(@Param('id') id: string): SimulationRunMetadata {
    const metadata = this.service.getMetadata(id);
    return metadata;
  }
}
