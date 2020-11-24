import { KisaoOntologyId } from '@biosimulations/datamodel/api';
import {
  AlgorithmParameter as IAlgorithmParameter,
  AlgorithmParameterType,
} from '@biosimulations/datamodel/common';

import { ApiProperty } from '@nestjs/swagger';

export class AlgorithmParameter implements IAlgorithmParameter {
  @ApiProperty()
  kisaoId!: KisaoOntologyId;

  @ApiProperty({
    type: String,
    nullable: true,
    required: false,
    default: null,
  })
  id!: string | null;

  @ApiProperty({
    type: String,
    nullable: true,
    required: false,
    default: null
  })
  name!: string | null;

  @ApiProperty({
    enum: AlgorithmParameterType,
  })
  type!: AlgorithmParameterType;

  @ApiProperty({
    type: String,
    example: "30.5",
    nullable: true,
  })
  value!: string | null;

  @ApiProperty({
    type: [String],
    example: ["22.7", "2270"],
    nullable: true,
  })
  recommendedRange!: string[] | null;
}
