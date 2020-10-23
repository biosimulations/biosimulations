import {
  ExternalReferences,
  Person,
} from '@biosimulations/shared/datamodel-api';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { AlgorithmSchema } from './algorithm';
import { EdamOntologyIdSchema, SpdxIdSchema } from './ontologyId';
import { Algorithm } from './algorithm';
import { IEdamOntologyId, ISpdxId } from '@biosimulations/shared/datamodel';
import { BiosimulatorsMeta } from './biosimulatorsMeta';

@Schema({})
class Simulator extends Document {
  @Prop()
  biosimulators!: BiosimulatorsMeta;
  @Prop({ lowercase: true, trim: true, required: true })
  id!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  version!: string;

  @Prop({ text: true, required: true })
  description!: string;

  @Prop({})
  url!: string;

  @Prop({})
  image!: string;

  @Prop({ type: EdamOntologyIdSchema })
  format!: IEdamOntologyId;

  @Prop({ items: Object })
  authors!: Person[];

  @Prop({ type: ExternalReferences })
  references!: ExternalReferences;

  @Prop({ type: SpdxIdSchema })
  license!: ISpdxId;

  @Prop({ type: [AlgorithmSchema], _id: false, required: true })
  algorithms!: Algorithm[];

  created!: Date;

  updated!: Date;
}
export const SimulatorSchema = SchemaFactory.createForClass(Simulator);
SimulatorSchema.index({ id: 1, version: 1 }, { unique: true });
SimulatorSchema.set('timestamps', {
  createdAt: 'created',
  updatedAt: 'updated',
});

//SimulatorSchema.set('id', false);
