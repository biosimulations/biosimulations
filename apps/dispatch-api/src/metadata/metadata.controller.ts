import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  VERSION_NEUTRAL,
} from '@nestjs/common';

import { ApiBody, ApiTags } from '@nestjs/swagger';

import { MetadataInput, Metadata } from '@biosimulations/datamodel/api';
import { MetadataService } from './metadata.service';

@ApiTags('Metadata')
@Controller({ path: 'metadata', version: VERSION_NEUTRAL })
export class MetadataController {
  public constructor(private service: MetadataService) {}

  @ApiBody({ type: MetadataInput })
  @Post()
  public makeMetadata(@Body() body: MetadataInput): Metadata {
    const Metadata = this.service.saveMetadata(body);
    return Metadata;
  }

  @Get()
  public getAllMetadata(): Metadata[] {
    const Metadata = this.service.getMetadata();
    return Metadata;
  }

  @Get(':id')
  public getMetadata(@Param('id') id: string): Metadata {
    const Metadata = this.service.getMetadata(id);
    return Metadata;
  }
}
