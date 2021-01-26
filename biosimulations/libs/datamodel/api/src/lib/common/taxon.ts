import { Taxon as ITaxon } from '@biosimulations/datamodel/common';
import { ApiProperty } from '@nestjs/swagger';
export class Taxon implements ITaxon {
  @ApiProperty({ type: Number, example: 9606 })
  id!: number;

  @ApiProperty({ type: String, example: 'Homo sapiens' })
  name!: string;
}
