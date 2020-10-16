import { PrimitiveType } from '@biosimulations/shared/datamodel';
import {
  KisaoOntologyId,
  KisaoOntologyIdSchema,
  OntologyId,
} from './ontologyId';
import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class AlgorithmParameter {
  @Prop({ type: KisaoOntologyIdSchema })
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
export const AlgorithmParameterSchema = SchemaFactory.createForClass(
  AlgorithmParameter
);
