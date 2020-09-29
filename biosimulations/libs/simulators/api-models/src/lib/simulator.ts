import {
  Format as IFormat,
  License,
  KISAOTerm,
  IOntologyTerm,
  IAlgorithm,
  JournalReference,
  AlgorithmParameter, KisaoIdRegEx
} from '@biosimulations/shared/datamodel';
import {
  ExternalReferences,
  Person,
} from '@biosimulations/shared/datamodel-api';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { AlgorithmSchema } from './algorithm';
import { EdamOntologyId, EdamOntologyIdSchema, SpdxId } from './ontologyId';
import { Algorithm } from './algorithm';

// TODO Split database and api models?
@Schema({ typePojoToMixed: false })
export class Simulator extends Document {
  @ApiProperty({
    example: 'tellurium',
    name: 'id',
  })
  @Prop({ lowercase: true, trim: true, required: true })
  id!: string;

  @ApiProperty({ example: 'Tellurium' })
  @Prop({ required: true })
  name!: string;

  @ApiProperty({
    example: '2.4.1',
  })
  @Prop({ required: true })
  version!: string;


  @Prop({ text: true })
  @ApiProperty({
    example:
      'Tellurium is a Python-based environment for model building, simulation, and analysis that facilitates reproducibility of models in systems and synthetic biology.',
  })
  description!: string;


  @Prop({})
  @ApiProperty({
    example: 'http://tellurium.analogmachine.org/',
  })
  url!: string;


  @Prop()
  @ApiProperty({
    example: 'docker.io/biosimulators/tellurium:2.4.1',
  })
  image!: string;


  @ApiProperty({ type: EdamOntologyId })
  @Prop({ type: EdamOntologyIdSchema })
  format!: EdamOntologyId;

  @ApiProperty({ type: [Person] })
  @Prop({ items: Object })
  authors!: Person[];
  @ApiProperty({ type: ExternalReferences })
  @Prop({ type: ExternalReferences })
  references!: ExternalReferences;
  @ApiProperty({ type: SpdxId })
  @Prop()
  license!: SpdxId;
  @ApiProperty({ type: [Algorithm] })
  @Prop({ type: [AlgorithmSchema], _id: false, required: true, })
  algorithms!: Algorithm[];

  @ApiResponseProperty({})
  created!: Date;
  @ApiResponseProperty({})
  updated!: Date;
}
export const SimulatorSchema = SchemaFactory.createForClass(Simulator);
SimulatorSchema.index({ id: 1, version: 1 }, { unique: true });
SimulatorSchema.set('timestamps', {
  createdAt: 'created',
  updatedAt: 'updated',
});

//SimulatorSchema.set('id', false);
