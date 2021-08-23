import {
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Post,
  VERSION_NEUTRAL,
} from '@nestjs/common';

import { ApiBody, ApiTags } from '@nestjs/swagger';

import {
  SimulationRunMetadata,
  SimulationRunMetadataInput,
} from '@biosimulations/datamodel/api';
import { MetadataService } from './metadata.service';
import { SimulationRunMetadataModel } from './metadata.model';

@ApiTags('Metadata')
@Controller({ path: 'metadata', version: VERSION_NEUTRAL })
export class MetadataController {
  private logger= new Logger(MetadataController.name);
  public constructor(private service: MetadataService) {}

  @ApiBody({ type: SimulationRunMetadataInput })
  @Post()
  public async makeMetadata(
    @Body() body: SimulationRunMetadataInput,
  ): Promise<SimulationRunMetadata> {
    const input = { ...body, simulationRun: body.id }
    const metadata = await this.service.createMetadata(input);
    const data = metadata.metadata;
    return new SimulationRunMetadata(metadata.simulationRun, data, metadata.created, metadata.updated);
    
  }

  @Get()
  public async getAllMetadata(): Promise<SimulationRunMetadata[]> {
    const metadatas = await this.service.getAllMetadata();
    const ret = metadatas.map((metadata: SimulationRunMetadataModel) => {
      const data = metadata.metadata;
      
      return new SimulationRunMetadata(metadata.simulationRun, data, metadata.created, metadata.updated);
    
    });
    
    return ret
  }

  @Get(':id')
  public async getMetadata(@Param('id') id: string): Promise<SimulationRunMetadata> {
    const metadata = await this.service.getMetadata(id);
    
    if (!metadata) {
      throw new NotFoundException(`Metadata with id ${id} not found`);
    }
    const simid = metadata.simulationRun
    const data = metadata.metadata

    return new SimulationRunMetadata(simid,data, metadata.created, metadata.updated);
  }
}
