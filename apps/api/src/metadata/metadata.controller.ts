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
import {
  ApiBody,
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiPayloadTooLargeResponse,
} from '@nestjs/swagger';

import {
  SimulationRunMetadata,
  SimulationRunMetadataInput,
} from '@biosimulations/datamodel/api';
import { MetadataService } from './metadata.service';
import { SimulationRunMetadataModel } from './metadata.model';
import { permissions } from '@biosimulations/auth/nest';
import { ErrorResponseDocument } from '@biosimulations/datamodel/api';

@ApiTags('Metadata')
@Controller({ path: 'metadata', version: VERSION_NEUTRAL })
export class MetadataController {
  private logger = new Logger(MetadataController.name);
  public constructor(private service: MetadataService) {}

  @ApiOperation({
    summary: 'Create Metadata for SimulationRun',
    description:
      'Upload metadata about the simulation project of a simulation run',
  })
  @ApiBody({
    description: 'Metadata about the simulation project of a simulation run',
    type: SimulationRunMetadataInput,
  })
  @ApiPayloadTooLargeResponse({
    type: ErrorResponseDocument,
    description:
      'The payload is too large. The payload must be less than the server limit.',
  })
  @ApiCreatedResponse({
    description: 'The metadata was successfully saved to the database',
    type: SimulationRunMetadata,
  })
  @Post()
  @permissions('write:Metadata')
  public async makeMetadata(
    @Body() body: SimulationRunMetadataInput,
  ): Promise<SimulationRunMetadata> {
    const input = { ...body, simulationRun: body.id };
    const metadata = await this.service.createMetadata(input);
    const data = metadata.metadata;
    return new SimulationRunMetadata(
      metadata.simulationRun,
      data,
      metadata.created,
      metadata.updated,
    );
  }

  @ApiOperation({
    summary: 'Get metadata for all simulation runs.',
    description:
      'Get metadata about the simulation projects of all simulation runs.',
  })
  @ApiOkResponse({
    description:
      'Metadata about the simulation projects were successfully retrieved',
    type: [SimulationRunMetadata],
  })
  @ApiNotFoundResponse({
    description: 'No metadata found',
    type: ErrorResponseDocument,
  })
  @permissions('read:Metadata')
  @Get()
  public async getAllMetadata(): Promise<SimulationRunMetadata[]> {
    const metadatas = await this.service.getAllMetadata();
    if (!metadatas) {
      throw new NotFoundException('No metadata found');
    }
    const ret = metadatas.map((metadata: SimulationRunMetadataModel) => {
      const data = metadata.metadata;

      return new SimulationRunMetadata(
        metadata.simulationRun,
        data,
        metadata.created,
        metadata.updated,
      );
    });

    return ret;
  }

  @ApiOperation({
    summary: 'Get metadata for a simulation run',
    description:
      'Returns metadata about the simulation project of a simulation run',
  })
  @ApiParam({
    name: 'runId',
    description: 'Id of the simulation run',
    required: true,
    type: String,
  })
  @ApiOkResponse({
    description:
      'Metadata about the simulation project was successfully retrieved',
    type: SimulationRunMetadata,
  })
  @ApiNotFoundResponse({
    description:
      'Metadata is not available for the requested simulation run id',
    type: ErrorResponseDocument,
  })
  @Get(':runId')
  public async getMetadata(
    @Param('runId') runId: string,
  ): Promise<SimulationRunMetadata> {
    const metadata = await this.service.getMetadata(runId);

    if (!metadata) {
      throw new NotFoundException(`Metadata with id ${runId} not found`);
    }
    const simId = metadata.simulationRun;
    const data = metadata.metadata;

    return new SimulationRunMetadata(
      simId,
      data,
      metadata.created,
      metadata.updated,
    );
  }
}
