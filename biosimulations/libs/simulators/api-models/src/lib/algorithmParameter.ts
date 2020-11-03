import { AlgorithmParameterType } from '@biosimulations/shared/datamodel';
import { KisaoOntologyId } from './ontologyId';
import { ApiProperty } from '@nestjs/swagger';

export class AlgorithmParameter {
  @ApiProperty()
  kisaoId!: KisaoOntologyId;

  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({
    enum: AlgorithmParameterType,
  })
  type!: AlgorithmParameterType;

  @ApiProperty({
    type: String,
  })
  value!: boolean | number | string;

  @ApiProperty({
    type: [String, Number, Boolean],
    maxItems: 2,
    minItems: 1,
    example: [22.7, 2270],
  })
  recommendedRange!: (boolean | number | string)[] | null;
}
