import {
  ApiExtraModels,
  ApiProperty,
  ApiResponseProperty,
  IntersectionType,
  OmitType,
} from '@nestjs/swagger';
import { ArchiveMetadata, ArchiveMetadataContainer } from './archiveMetadata';

@ApiExtraModels(ArchiveMetadata)
export class SimulationRunMetadata {
  @ApiProperty({ example: '609aeb11d70ea3752d097015' })
  public id!: string;
  @ApiProperty({ name: 'public', example: true })
  public isPublic!: boolean;
  @ApiProperty({ type: [ArchiveMetadata] })
  public metadata!: ArchiveMetadata[];

  @ApiResponseProperty()
  public created: string;

  @ApiResponseProperty()
  public modified: string;

  public constructor(
    simulationRun: string,
    metadata: ArchiveMetadata[],
    isPublic: boolean,
    created: string,
    modified: string,
  ) {
    this.id = simulationRun;
    this.isPublic = isPublic;
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
