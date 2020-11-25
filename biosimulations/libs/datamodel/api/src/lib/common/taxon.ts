import { Taxon as ITaxon } from '@biosimulations/datamodel/common';
import { ApiProperty, ApiExtraModels, OmitType } from '@nestjs/swagger';
export class Taxon implements ITaxon {
  @ApiProperty({ example: 9606 })
  id!: number;

  @ApiProperty({ example: 'Homo sapiens' })
  name!: string;
}
