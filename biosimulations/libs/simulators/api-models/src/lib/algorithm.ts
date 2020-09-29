import {
  Format as IFormat,
  Person,
  ExternalReferences,
  License,
  KISAOTerm,
  IOntologyTerm,
  IAlgorithm, KisaoIdRegEx
} from '@biosimulations/shared/datamodel';
import { JournalReference } from '@biosimulations/shared/datamodel-api';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import {
  EdamOntologyId,
  OntologyId,
  KisaoOntologyId,
  SBOOntologyId,
  EdamOntologyIdSchema, OntologyIdSchema, KisaoOntologyIdSchema, SBOOntologyIdSchema
} from './ontologyId';
import { ApiProperty } from '@nestjs/swagger';
import { AlgorithmParameter, AlgorithmParameterSchema } from './algorithmParameter';

// TODO separate api and db schemas?
@Schema({})
export class Algorithm implements IAlgorithm {
  @ApiProperty()
  @Prop({ type: KisaoOntologyIdSchema })
  kisaoId!: KisaoOntologyId;
  @ApiProperty({ type: [AlgorithmParameter], })
  @Prop({ type: [AlgorithmParameterSchema] })
  parameters: AlgorithmParameter[] = [];
  @Prop()
  @ApiProperty()
  id!: string;
  @Prop()
  @ApiProperty()
  name!: string;
  @ApiProperty({ type: [KisaoOntologyId] })
  @Prop({ type: [KisaoOntologyIdSchema] })
  kisaoSynonyms!: KisaoOntologyId[];
  @ApiProperty({ type: [OntologyId] })
  @Prop({ type: [OntologyIdSchema], })
  characteristics!: OntologyId[];
  @ApiProperty({ type: [SBOOntologyId] })
  @Prop({ type: [SBOOntologyIdSchema], _id: false })
  modelingFrameworks!: SBOOntologyId[];

  @ApiProperty({ type: [EdamOntologyId] })
  @Prop({ type: [EdamOntologyIdSchema], _id: false })
  modelFormats!: EdamOntologyId[];

  @ApiProperty({ type: [EdamOntologyId] })
  @Prop({ type: [EdamOntologyIdSchema], _id: false })
  simulationFormats!: EdamOntologyId[];
  @ApiProperty({ type: [EdamOntologyId] })
  @Prop({ type: [EdamOntologyIdSchema], _id: false })
  archiveFormats!: EdamOntologyId[];
  @ApiProperty({ type: [JournalReference] })
  @Prop({})
  citations!: JournalReference[];
}
export const AlgorithmSchema = SchemaFactory.createForClass(Algorithm);
