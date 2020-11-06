import {
  AlgorithmParameter as IAlgorithmParameter,
  AlgorithmParameterType,
} from '@biosimulations/datamodel/common';
import { KisaoOntologyId } from './ontologyId';
import { ApiProperty } from '@nestjs/swagger';

export class AlgorithmParameter implements IAlgorithmParameter {
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
  value!: string;

  @ApiProperty({
    type: [String, Number, Boolean],
    maxItems: 2,
    minItems: 1,
    example: [22.7, 2270],
  })
  recommendedRange!: string[] | null;
}
