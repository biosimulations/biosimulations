import {
  Format as IFormat,
  License,
  KISAOTerm,
  IOntologyTerm,
  IAlgorithm,
  JournalReference,
  AlgorithmParameter,
} from '@biosimulations/shared/datamodel';
import {
  ExternalReferences,
  Person,
} from '@biosimulations/shared/datamodel-api';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { AlgorithmSchema } from './algorithm';
import { EdamOntologyId, EdamOntologyIdSchema } from './ontologyId';
import { Algorithm } from './algorithm';

// TODO Split database and api models?
@Schema()
export class Simulator extends Document {
  @ApiProperty({
    example: 'tellurium',
    name: 'id',
  })
  @Prop({ required: true })
  id!: string;

  @Prop({ required: true })
  @ApiProperty({ example: 'Tellurium' })
  name!: string;

  @Prop({ required: true })
  @ApiProperty({
    example: '2.4.1',
  })
  version!: string;
  @Prop()
  @ApiProperty({
    example:
      'Tellurium is a Python-based environment for model building, simulation, and analysis that facilitates reproducibility of models in systems and synthetic biology.',
  })
  description!: string;
  @Prop()
  @ApiProperty({
    example: 'http://tellurium.analogmachine.org/',
  })
  url!: string;
  @Prop()
  @ApiProperty({
    example: 'docker.io/biosimulators/tellurium:2.4.1',
  })
  image!: string;
  @Prop({ type: EdamOntologyIdSchema, _id: false })
  @ApiProperty({ type: EdamOntologyId })
  format!: EdamOntologyId;
  @ApiProperty({ type: [Person] })
  @Prop({ items: Object })
  authors!: Person[];
  @ApiProperty({})
  @Prop({ type: ExternalReferences })
  references!: ExternalReferences;
  @Prop({ type: Object })
  @ApiProperty({ enum: License })
  license!: License;
  @ApiProperty({ type: [Algorithm] })
  @Prop({ items: AlgorithmSchema, _id: false })
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
