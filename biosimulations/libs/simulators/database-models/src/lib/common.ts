import {
  ExternalReferences as IExternalReferences,
  Identifier,
  Citation as ICitation,
} from '@biosimulations/datamodel/common';

import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { IdentifierSchema } from './ontologyId';

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
  useNestedStrict: true,
})
class Citation implements ICitation {
  @Prop({ type: String, required: true, default: undefined })
  authors!: string;

  @Prop({ type: String, required: true, default: undefined })
  title!: string;

  @Prop({ type: String, required: false, default: null })
  journal!: string | null;

  @Prop({
    type: String,
    required: false,
    default: null,
  })
  volume!: string | null;

  @Prop({
    type: String,
    required: false,
    default: null,
  })
  issue!: string | null;

  @Prop({ type: String, required: false, default: null })
  pages!: string | null;

  @Prop({
    Type: Number,
    min: 1500,
    max: new Date(Date.now()).getFullYear() + 1,
    required: true,
    default: undefined,
  })
  year!: number;

  @Prop({
    type: [IdentifierSchema],
    required: true,
    default: undefined,
  })
  identifiers!: Identifier[];
}

export const CitationSchema = SchemaFactory.createForClass(Citation);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
  useNestedStrict: true,
})
export class ExternalReferences implements IExternalReferences {
  @Prop({ type: [IdentifierSchema], required: true, default: undefined })
  identifiers!: Identifier[];

  @Prop({ type: [CitationSchema], required: true, default: undefined })
  citations!: Citation[];
}

export const ExternalReferencesSchema = SchemaFactory.createForClass(
  ExternalReferences
);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
  useNestedStrict: true,
})
class Person {
  @Prop({ type: String, required: false, default: null })
  firstName!: string | null;

  @Prop({ type: String, required: false, default: null })
  middleName!: string | null;

  @Prop({ type: String, required: true, default: undefined })
  lastName!: string;

  @Prop({ type: [IdentifierSchema], required: true, default: undefined })
  identifiers!: Identifier[];
}

export const PersonSchema = SchemaFactory.createForClass(Person);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
  useNestedStrict: true,
})
class Url {
  @Prop({ type: String, required: true, default: undefined })
  url!: string;

  @Prop({ type: String, required: true, default: undefined })
  title!: string;
}

export const UrlSchema = SchemaFactory.createForClass(Url);
