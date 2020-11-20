import {
  AlgorithmParameterType,
  AlgorithmParameter as IAlgorithmParameter,
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
  @Prop({ type: KisaoOntologyIdSchema })
  kisaoId!: IKisaoOntologyId;
  @Prop()
  id!: string;
  @Prop()
  name!: string;
  @Prop()
  type!: AlgorithmParameterType;
  @Prop()
  value!: string;
  @Prop({ required: false })
  recommendedRange!: string[] | null;
}
export const AlgorithmParameterSchema = SchemaFactory.createForClass(
  AlgorithmParameter
);
