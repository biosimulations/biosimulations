import { ExternalReferences, Person } from '@biosimulations/datamodel/api';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { AlgorithmSchema } from './algorithm';
import { EdamOntologyIdSchema, SpdxIdSchema } from './ontologyId';
import { Algorithm } from './algorithm';
import { IEdamOntologyId, ISpdxId } from '@biosimulations/datamodel/common';

import { ExternalReferencesSchema, PersonSchema } from './common';
import { BiosimulatorsMeta } from './biosimulatorsMeta';

@Schema({})
export class Simulator extends Document {
  @Prop()
  biosimulators!: BiosimulatorsMeta;
  @Prop({ type: String, lowercase: true, trim: true, required: true })
  id!: string;

  @Prop({ type: String, required: true })
  name!: string;

  @Prop({ type: String, required: true })
  version!: string;

  @Prop({ type: String, text: true, required: true })
  description!: string;

  @Prop({})
  url!: string;

  @Prop({})
  image!: string;

  @Prop({ type: EdamOntologyIdSchema })
  format!: IEdamOntologyId;

  @Prop({ items: [PersonSchema] })
  authors!: Person[];

  @Prop({ type: ExternalReferencesSchema })
  references!: ExternalReferences;

  @Prop({ type: SpdxIdSchema })
  license!: ISpdxId;

  @Prop({ type: [AlgorithmSchema], _id: false, required: true })
  algorithms!: Algorithm[];

  created!: Date;

  updated!: Date;
}
export const SimulatorSchema = SchemaFactory.createForClass(Simulator);

// Can not be set in the decorator for compund schemas.
SimulatorSchema.index({ id: 1, version: 1 }, { unique: true });
SimulatorSchema.set('timestamps', {
  createdAt: 'created',
  updatedAt: 'updated',
});
SimulatorSchema.set('strict', 'throw');
// This should be kept true so that subdocuments can override the strict mode requirement
SimulatorSchema.set('useNestedStrict', true);
//SimulatorSchema.set('id', false);
