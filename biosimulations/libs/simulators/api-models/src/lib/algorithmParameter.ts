import { PrimitiveType } from '@biosimulations/shared/datamodel';
import { KisaoOntologyId, OntologyId } from './ontologyId';
import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


@Schema({ _id: false })
export class AlgorithmParameter {
  @Prop()
  @ApiProperty()
  kisaoId!: KisaoOntologyId;
  @Prop()
  @ApiProperty()
  kisaoSynonyms!: KisaoOntologyId[];
  @Prop()
  @ApiProperty({ required: true })
  characteristics!: OntologyId[];
  @Prop()
  @ApiProperty()
  id!: string;
  @Prop()
  @ApiProperty()
  name!: string;
  @Prop()
  @ApiProperty({
    enum: [PrimitiveType],
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
export const AlgorithmParameterSchema = SchemaFactory.createForClass(AlgorithmParameter);