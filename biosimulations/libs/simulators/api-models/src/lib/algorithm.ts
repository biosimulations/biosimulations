import {
  Format as IFormat,
  Person,
  ExternalReferences,
  License,
  KISAOTerm,
  IOntologyTerm,
  IAlgorithm,
} from '@biosimulations/shared/datamodel';
import { JournalReference } from '@biosimulations/shared/datamodel-api';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import {
  EdamOntologyId,
  OntologyId,
  KisaoOntologyId,
  SBOOntologyId,
} from './ontologyId';
import { ApiProperty } from '@nestjs/swagger';
import { AlgorithmParameter } from './algorithmParameter';

// TODO align with shared datamodel
@Schema()
export class Algorithm implements IAlgorithm {
  @Prop()
  @ApiProperty()
  kisaoId!: KisaoOntologyId;
  @Prop()
  @ApiProperty({ type: [AlgorithmParameter] })
  parameters: AlgorithmParameter[] = [];
  @Prop()
  @ApiProperty()
  id!: string;
  @Prop()
  @ApiProperty()
  name!: string;
  @Prop()
  @ApiProperty({ type: [KisaoOntologyId] })
  kisaoSynonyms!: KisaoOntologyId[];
  @Prop()
  @ApiProperty({ type: [KisaoOntologyId] })
  characteristics!: OntologyId[];
  @Prop()
  @ApiProperty({ type: [SBOOntologyId] })
  modelingFrameworks!: SBOOntologyId[];

  @ApiProperty({ type: [EdamOntologyId] })
  @Prop({ items: EdamOntologyId, _id: false })
  modelFormats!: EdamOntologyId[];

  @ApiProperty({ type: [EdamOntologyId] })
  @Prop({ items: EdamOntologyId, _id: false })
  simulationFormats!: EdamOntologyId[];
  @ApiProperty({ type: [EdamOntologyId] })
  @Prop({ items: EdamOntologyId, _id: false })
  archiveFormats!: EdamOntologyId[];
  @ApiProperty({ type: [JournalReference] })
  @Prop({})
  citations!: JournalReference[];
}
export const AlgorithmSchema = SchemaFactory.createForClass(Algorithm);
