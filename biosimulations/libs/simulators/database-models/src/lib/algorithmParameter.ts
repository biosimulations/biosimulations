import {
  AlgorithmParameterType,
  AlgorithmParameter as IAlgorithmParameter,
} from '@biosimulations/datamodel/common';
import { KisaoOntologyIdSchema } from './ontologyId';
import { IKisaoOntologyId, addValidationForNullableAttributes } from '@biosimulations/datamodel/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
  useNestedStrict: true,
})
export class AlgorithmParameter implements IAlgorithmParameter {
  @Prop({ type: KisaoOntologyIdSchema, required: true })
  kisaoId!: IKisaoOntologyId;

  @Prop({
    type: String,
    required: true,
    // required: false,
    // default: null,
  })
  id!: string;

  @Prop({
    type: String,
    required: false,
    default: null,
  })
  name!: string | null;

  @Prop({ 
    type: String,
    enum: Object.keys(AlgorithmParameterType).map(
      (k) => AlgorithmParameterType[k as AlgorithmParameterType]
    ),
    required: true,
  })
  type!: AlgorithmParameterType;

  @Prop({ type: String, required: false, default: undefined })
  value!: string | null;

  @Prop({ type: [String], required: false, default: undefined })
  recommendedRange!: string[] | null;
}

export const AlgorithmParameterSchema = SchemaFactory.createForClass(
  AlgorithmParameter
);

addValidationForNullableAttributes(AlgorithmParameterSchema);
