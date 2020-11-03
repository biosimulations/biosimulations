import {
  PrimitiveType,
  AlgorithmParameter as IAlgorithmParameter,
} from '@biosimulations/shared/datamodel';
import { KisaoOntologyIdSchema } from './ontologyId';
import { IKisaoOntologyId } from '@biosimulations/shared/datamodel';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false, storeSubdocValidationError: false })
export class AlgorithmParameter implements IAlgorithmParameter {
  @Prop({ type: KisaoOntologyIdSchema })
  kisaoId!: IKisaoOntologyId;
  @Prop()
  id!: string;
  @Prop()
  name!: string;
  @Prop({
    type: String,
    enum: Object.values(PrimitiveType).sort(),
    required: true,
  })
  type!: PrimitiveType;
  @Prop()
  value!: boolean | number | string;
  @Prop()
  recommendedRange!: (boolean | number | string)[] | null;
}
export const AlgorithmParameterSchema = SchemaFactory.createForClass(
  AlgorithmParameter
);
