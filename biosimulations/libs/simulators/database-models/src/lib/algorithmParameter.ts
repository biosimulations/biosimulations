import {
  ValueType,
  AlgorithmParameter as IAlgorithmParameter,
  SoftwareInterfaceType,
} from '@biosimulations/datamodel/common';
import { KisaoOntologyIdSchema } from './ontologyId';
import { IKisaoOntologyId } from '@biosimulations/datamodel/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
  useNestedStrict: true,
})
export class AlgorithmParameter implements IAlgorithmParameter {
  @Prop({ type: KisaoOntologyIdSchema, required: true, default: undefined })
  kisaoId!: IKisaoOntologyId;

  @Prop({
    type: String,
    required: false,
    default: null,
  })
  id!: string | null;

  @Prop({
    type: String,
    required: false,
    default: null,
  })
  name!: string | null;

  @Prop({ 
    type: String,
    enum: Object.keys(ValueType).map(
      (k) => ValueType[k as ValueType]
    ),
    required: true,
    default: undefined,
  })
  type!: ValueType;

  @Prop({ type: String, required: false, default: undefined })
  value!: string | null;

  @Prop({ type: [String], required: false, default: undefined })
  recommendedRange!: string[] | null;

  @Prop({
    type: [String],
    enum: Object.entries(SoftwareInterfaceType).map((keyVal: [string, string]): string => {
      return keyVal[1];
    }),
    required: true,
    default: undefined,
  })
  availableSoftwareInterfaceTypes!: SoftwareInterfaceType[];
}

export const AlgorithmParameterSchema = SchemaFactory.createForClass(
  AlgorithmParameter
);
