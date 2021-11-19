import {
  ApiExtraModels,
  ApiProperty,
  ApiResponseProperty,
} from '@nestjs/swagger';
import { ArchiveMetadata } from '../common/archiveMetadata';
import { IsMongoId, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

@ApiExtraModels(ArchiveMetadata)
export class SimulationRunMetadata {
  @ApiProperty({
    type: String,
    description: 'Id of the metadata',
    example: '609aeb11d70ea3752d097015',
  })
  @IsMongoId()
  public id!: string;

  @ApiProperty({
    description:
      'Metadata about the COMBINE/OMEX archive of the simulation run or files in the archive',
    type: [ArchiveMetadata],
  })
  @ValidateNested({ each: true })
  @Type(() => ArchiveMetadata)
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
