import { ExternalReferences, Person } from '@biosimulations/datamodel/api';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import isUrl from 'is-url';

import { ImageSchema } from './image';
import { AlgorithmSchema } from './algorithm';
import { SpdxIdSchema } from './ontologyId';
import { Algorithm } from './algorithm';
import { IImage, ISpdxId, addValidationForNullableAttributes } from '@biosimulations/datamodel/common';

import { ExternalReferencesSchema, PersonSchema } from './common';
import { BiosimulatorsMeta, BiosimulatorsMetaSchema } from './biosimulatorsMeta';

@Schema({})
export class Simulator extends Document {
  @Prop({ type: BiosimulatorsMetaSchema, required: true })
  biosimulators!: BiosimulatorsMeta;

  @Prop({ type: String, lowercase: true, trim: true, required: true })
  id!: string;

  @Prop({ type: String, required: true })
  name!: string;

  @Prop({ type: String, required: true })
  version!: string;

  @Prop({ type: String, text: true, required: true })
  description!: string;

  @Prop({
    type: String,
    required: true,
    validate: [{
      validator: isUrl,
      message: (props: any): string => `${props.value} is not a valid URL`,
    }],
  })
  url!: string;

  @Prop({ type: ImageSchema, required: false, default: undefined })
  image!: IImage | null;

  @Prop({ type: [PersonSchema], required: true })
  authors!: Person[];

  @Prop({ type: ExternalReferencesSchema, required: true })
  references!: ExternalReferences;

  @Prop({ type: SpdxIdSchema, required: false, default: undefined })
  license!: ISpdxId | null;

  @Prop({
    type: [AlgorithmSchema], 
    _id: false, 
    required: true,
  })
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

/* handle nullable attributes */
addValidationForNullableAttributes(SimulatorSchema);
