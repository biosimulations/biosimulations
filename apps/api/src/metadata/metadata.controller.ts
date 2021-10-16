import {
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Post,
  Req,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiBody,
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';

import {
  SimulationRunMetadata,
  SimulationRunMetadataInput,
} from '@biosimulations/datamodel/api';
import { MetadataService } from './metadata.service';
import { SimulationRunMetadataModel } from './metadata.model';
import { OptionalAuth, permissions } from '@biosimulations/auth/nest';
import { AuthToken } from '@biosimulations/auth/common';
import { ErrorResponseDocument } from '@biosimulations/datamodel/api';

@ApiTags('Metadata for projects (COMBINE/OMEX archive) of simulation runs')
@Controller({ path: 'metadata', version: VERSION_NEUTRAL })
export class MetadataController {
  private logger = new Logger(MetadataController.name);
  public constructor(private service: MetadataService) {}

  @ApiOperation({
    summary: 'Post metadata about the simulation project of a simulation run',
    description:
      'Upload metadata about the simulation project of a simulation run',
  })
  @ApiBody({
    description: 'Metadata about the simulation project of a simulation run',
    type: SimulationRunMetadataInput,
  })
  @ApiCreatedResponse({
    description: 'The metadata was successfully saved to the database',
    type: SimulationRunMetadata,
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDocument,
    description: 'A valid authorization was not provided',
  })
  @ApiForbiddenResponse({
    type: ErrorResponseDocument,
    description:
      'This account does not have permission to save metadata about simulation projects',
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
      metadata.isPublic,
      metadata.created,
      metadata.updated,
    );
  }

  @ApiOperation({
    summary:
      'Get metadata about the simulation projects of all simulation runs. ',
    description:
      'Get metadata about the simulation projects of all simulation runs. Regular users are limited to metadata about projects of published runs.',
  })
  @ApiOkResponse({
    description:
      'Metadata about the simulation projects were successfully retrieved',
    type: [SimulationRunMetadata],
  })
  @OptionalAuth()
  @Get()
  public async getAllMetadata(
    @Req() req: Request,
  ): Promise<SimulationRunMetadata[]> {
    const user = req?.user as AuthToken;
    let permission = false;
    if (user) {
      user.permissions = user.permissions || [];
      permission = user.permissions.includes('read:Metadata');
    }
    const metadatas = await this.service.getAllMetadata(permission);
    const ret = metadatas.map((metadata: SimulationRunMetadataModel) => {
      const data = metadata.metadata;

      return new SimulationRunMetadata(
        metadata.simulationRun,
        data,
        metadata.isPublic,
        metadata.created,
        metadata.updated,
      );
    });

    return ret;
  }

  @ApiOperation({
    summary: 'Get metadata about the simulation project of a simulation run',
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
    @Param('runId') id: string,
  ): Promise<SimulationRunMetadata> {
    const metadata = await this.service.getMetadata(id);

    if (!metadata) {
      throw new NotFoundException(`Metadata with id ${id} not found`);
    }
    const simid = metadata.simulationRun;
    const data = metadata.metadata;

    return new SimulationRunMetadata(
      simid,
      data,
      metadata.isPublic,
      metadata.created,
      metadata.updated,
    );
  }
}
