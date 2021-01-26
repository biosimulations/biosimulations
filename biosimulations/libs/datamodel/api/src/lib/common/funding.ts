import { Funding as IFunding } from '@biosimulations/datamodel/common';
import { ApiProperty } from '@nestjs/swagger';
import { FunderRegistryOntologyId } from './ontologyId.dto';

export class Funding implements IFunding {
  @ApiProperty({ type: FunderRegistryOntologyId })
  funder!: FunderRegistryOntologyId;

  @ApiProperty({ type: String, nullable: true, required: false, default: null })
  grant!: string | null;

  @ApiProperty({
    type: String,
    format: 'url',
    nullable: true,
    required: false,
    default: null,
  })
  url!: string | null;
}
