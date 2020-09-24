import { PrimitiveType } from '@biosimulations/shared/datamodel';
import { KisaoOntologyId, OntologyId } from './ontologyId';
import { ApiProperty } from '@nestjs/swagger';
import { Prop } from '@nestjs/mongoose';

export class AlgorithmParameter {
  @Prop()
  @ApiProperty()
  kisaoId!: KisaoOntologyId;
  @Prop()
  @ApiProperty()
  kisaoSynonyms!: KisaoOntologyId[];
  @Prop()
  @ApiProperty()
  characteristics!: OntologyId[];
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
  recommendedRange!: (boolean | number | string)[] | null;
}
