import {
  IAlgorithm,
  IEdamOntologyId,
  IKisaoOntologyId,
  ISboOntologyId,
  SoftwareInterfaceType,
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

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
  useNestedStrict: true,
})
export class Algorithm implements IAlgorithm {
  @Prop({ type: KisaoOntologyIdSchema, required: true, default: undefined })
  kisaoId!: IKisaoOntologyId;

  @Prop({ type: [AlgorithmParameterSchema], required: false, default: undefined })
  parameters!: AlgorithmParameter[] | null;
  
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

  @Prop({ type: [SboOntologyIdSchema], _id: false, required: true, default: undefined })
  modelingFrameworks!: ISboOntologyId[];

  @Prop({ type: [EdamOntologyIdSchema], _id: false, required: true, default: undefined })
  modelFormats!: IEdamOntologyId[];

  @Prop({ type: [EdamOntologyIdSchema], _id: false, required: true, default: undefined })
  simulationFormats!: IEdamOntologyId[];

  @Prop({ type: [EdamOntologyIdSchema], _id: false, required: true, default: undefined })
  archiveFormats!: IEdamOntologyId[];

  @Prop({
    type: [String],
    enum: Object.entries(SoftwareInterfaceType).map((keyVal: [string, string]): string => {
      return keyVal[1];
    }),
    required: true,
    default: undefined,
  })
  availableSoftwareInterfaceTypes!: SoftwareInterfaceType[];

  @Prop({ type: [CitationSchema], _id: false, required: true, default: undefined })
  citations!: Citation[];
}

export const AlgorithmSchema = SchemaFactory.createForClass(Algorithm);
