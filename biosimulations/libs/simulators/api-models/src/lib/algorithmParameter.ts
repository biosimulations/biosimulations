import { PrimitiveType } from '@biosimulations/shared/datamodel';
import { KisaoOntologyId } from './ontologyId';
import { ApiProperty } from '@nestjs/swagger';
import { Prop } from '@nestjs/mongoose';

export class AlgorithmParameter {
  @Prop()
  @ApiProperty()
  kisaoId!: KisaoOntologyId;
  @Prop()
  @ApiProperty()
  id!: string;
  @Prop()
  @ApiProperty()
  name!: string;
  @Prop()
  @ApiProperty({
    type: String,
  })
  type!: PrimitiveType;
  @Prop()
  @ApiProperty({
    type: String,
  })
  value!: boolean | number | string;
  @Prop()
  @ApiProperty({
    type: [String, Number, Boolean],
    maxItems: 2,
    minItems: 1,
    example: [22.7, 2270],
  })
  recomendedRange!: (boolean | number | string)[] | null;
}
