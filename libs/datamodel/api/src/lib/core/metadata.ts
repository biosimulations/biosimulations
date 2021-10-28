import {
  ApiExtraModels,
  ApiProperty,
  ApiResponseProperty,
  IntersectionType,
  OmitType,
} from '@nestjs/swagger';
import {
  ArchiveMetadata,
  ArchiveMetadataContainer,
} from '../common/archiveMetadata';

@ApiExtraModels(ArchiveMetadata)
export class SimulationRunMetadata {
  @ApiProperty({
    type: String,
    description: 'Id of the metadata',
    example: '609aeb11d70ea3752d097015',
  })
  public id!: string;

  @ApiProperty({
    description:
      'Metadata about the COMBINE/OMEX archive of the simulation run or files in the archive',
    type: [ArchiveMetadata],
  })
  public metadata!: ArchiveMetadata[];

  @ApiResponseProperty({
    type: String,
    format: 'date-time',
    // description: 'Timestamp when the metadata was created',
  })
  public created: string;

  @ApiResponseProperty({
    type: String,
    format: 'date-time',
    // description: 'Timestamp when the metadata was last updated',
  })
  public modified: string;

  public constructor(
    simulationRun: string,
    metadata: ArchiveMetadata[],
    created: string,
    modified: string,
  ) {
    this.id = simulationRun;
    this.metadata = metadata;
    this.created = created;
    this.modified = modified;
  }
}

// eslint-disable-next-line max-len
export class SimulationRunMetadataInput extends IntersectionType(
  OmitType(SimulationRunMetadata, ['metadata', 'created', 'modified'] as const),
  ArchiveMetadataContainer,
) {}
