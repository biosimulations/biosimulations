import {
  IAlgorithm,
  IEdamOntologyId,
  IKisaoOntologyId,
  ISboOntologyId,
} from '@biosimulations/datamodel/common';
import { Citation } from '@biosimulations/datamodel/api';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import {
  EdamOntologyIdSchema,
  KisaoOntologyIdSchema,
  SboOntologyIdSchema,
} from './ontologyId';

import {
  AlgorithmParameter,
  AlgorithmParameterSchema,
} from './algorithmParameter';
import { CitationSchema } from './common';
import { addValidationForNullableAttributes } from '@biosimulations/datamodel/common';

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
  useNestedStrict: true,
})
export class Algorithm implements IAlgorithm {
  @Prop({ type: KisaoOntologyIdSchema, required: true })
  kisaoId!: IKisaoOntologyId;

  @Prop({ type: [AlgorithmParameterSchema], required: false, default: undefined })
  parameters!: AlgorithmParameter[] | null;
  
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
    // default: null,
  })
  name!: string | null;

  @Prop({ type: [SboOntologyIdSchema], _id: false, required: true })
  modelingFrameworks!: ISboOntologyId[];

  @Prop({ type: [EdamOntologyIdSchema], _id: false, required: true })
  modelFormats!: IEdamOntologyId[];

  @Prop({ type: [EdamOntologyIdSchema], _id: false, required: true })
  simulationFormats!: IEdamOntologyId[];

  @Prop({ type: [EdamOntologyIdSchema], _id: false, required: true })
  archiveFormats!: IEdamOntologyId[];

  @Prop({ type: [CitationSchema], _id: false, required: true })
  citations!: Citation[];
}

export const AlgorithmSchema = SchemaFactory.createForClass(Algorithm);

addValidationForNullableAttributes(AlgorithmSchema, {
  // id: null,
  name: null,
  parameters: undefined,
});

