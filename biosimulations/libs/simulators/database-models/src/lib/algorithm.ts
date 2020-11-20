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

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
  useNestedStrict: true,
})
export class Algorithm implements IAlgorithm {
  @Prop({ type: KisaoOntologyIdSchema })
  kisaoId!: IKisaoOntologyId;

  @Prop({ type: [AlgorithmParameterSchema], required: false, default: null })
  parameters!: AlgorithmParameter[] | null;
  @Prop()
  id!: string;
  @Prop()
  name!: string;

  @Prop({ type: [SboOntologyIdSchema], _id: false })
  modelingFrameworks!: ISboOntologyId[];

  @Prop({ type: [EdamOntologyIdSchema], _id: false })
  modelFormats!: IEdamOntologyId[];

  @Prop({ type: [EdamOntologyIdSchema], _id: false })
  simulationFormats!: IEdamOntologyId[];

  @Prop({ type: [EdamOntologyIdSchema], _id: false })
  archiveFormats!: IEdamOntologyId[];

  @Prop({ type: [CitationSchema], _id: false })
  citations!: Citation[];
}
export const AlgorithmSchema = SchemaFactory.createForClass(Algorithm);
