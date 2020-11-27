import { ExternalReferences, Person, Url } from '@biosimulations/datamodel/api';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { ImageSchema } from './image';
import { AlgorithmSchema } from './algorithm';
import { SpdxIdSchema } from './ontologyId';
import { Algorithm } from './algorithm';
import {
  IImage,
  ISpdxId,
  SoftwareInterfaceType,
  OperatingSystemType,
  addValidationForNullableAttributes,
} from '@biosimulations/datamodel/common';
import { linguistTerms } from './linguistTerms';

import { ExternalReferencesSchema, PersonSchema, UrlSchema } from './common';
import { BiosimulatorsMeta, BiosimulatorsMetaSchema } from './biosimulatorsMeta';

@Schema({})
export class Simulator extends Document {
  @Prop({ type: BiosimulatorsMetaSchema, required: true, default: undefined })
  biosimulators!: BiosimulatorsMeta;

  @Prop({ type: String, lowercase: true, trim: true, required: true, default: undefined })
  id!: string;

  @Prop({ type: String, required: true, default: undefined })
  name!: string;

  @Prop({ type: String, required: true, default: undefined })
  version!: string;

  @Prop({ type: String, text: true, required: true, default: undefined })
  description!: string;

  @Prop({ type: [UrlSchema], required: true, default: undefined })
  urls!: Url[];

  @Prop({ type: ImageSchema, required: false, default: undefined })
  image!: IImage | null;

  @Prop({ type: [PersonSchema], required: true, default: undefined })
  authors!: Person[];

  @Prop({ type: ExternalReferencesSchema, required: true, default: undefined })
  references!: ExternalReferences;

  @Prop({ type: SpdxIdSchema, required: false, default: undefined })
  license!: ISpdxId | null;

  @Prop({
    type: [AlgorithmSchema],
    _id: false,
    required: true,
    default: undefined,
  })
  algorithms!: Algorithm[];

  @Prop({
    type: [String],
    enum: Object.entries(SoftwareInterfaceType).map((keyVal: [string, string]): string => {
      return keyVal[1];
    }),
    required: true,
    default: undefined,
  })
  interfaceTypes!: SoftwareInterfaceType[];

  @Prop({
    type: [String],
    enum: Object.entries(OperatingSystemType).map((keyVal: [string, string]): string => {
      return keyVal[1];
    }),
    required: true,
    default: undefined,
  })
  supportedOperatingSystemTypes!: OperatingSystemType[];

  @Prop({
    type: [String],
    enum: linguistTerms,
    required: true,
    default: undefined,
  })
  supportedProgrammingLanguages!: string[];
}
export const SimulatorSchema = SchemaFactory.createForClass(Simulator);

// Can not be set in the decorator for compund schemas.
SimulatorSchema.index({ id: 1, version: 1 }, { unique: true });
SimulatorSchema.set('strict', 'throw');
// This should be kept true so that subdocuments can override the strict mode requirement
SimulatorSchema.set('useNestedStrict', true);
//SimulatorSchema.set('id', false);

/* handle nullable attributes */
addValidationForNullableAttributes(SimulatorSchema);
