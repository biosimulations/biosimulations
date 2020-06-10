import { Taxon } from '@biosimulations/datamodel/core';
import { ApiProperty, ApiExtraModels, OmitType } from '@nestjs/swagger';
export class TaxonDTO implements Taxon {
  @ApiProperty({ example: 9606 })
  id!: number;
  @ApiProperty({ example: 'Homo sapiens' })
  name!: string;
}
