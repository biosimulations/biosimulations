import { ApiExtraModels, ApiProperty, IntersectionType, OmitType } from '@nestjs/swagger';
import { ArchiveMetadata, ArchiveMetadataInputContainer } from './archiveMetadata';


@ApiExtraModels(ArchiveMetadata)
export class SimulationRunMetadata {
  @ApiProperty()
  public id!: string;
  @ApiProperty({ type: ArchiveMetadata })
  public metadata!: ArchiveMetadata[];
  @ApiProperty()
  public simulationRun: string;
  public constructor(id: string, simulationRun: string) {
    this.id = id;
    this.simulationRun = simulationRun;
  }
}


// eslint-disable-next-line max-len
export class SimulationRunMetadataInput extends IntersectionType (OmitType(SimulationRunMetadata, ['metadata'] as const), ArchiveMetadataInputContainer) { }