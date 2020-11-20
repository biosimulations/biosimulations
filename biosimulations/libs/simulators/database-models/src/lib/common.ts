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
  @Prop({ type: String, required: true })
  authors!: string;
  @Prop({ type: String, required: true })
  title!: string;
  @Prop({ type: String, required: false, default: null })
  journal!: string | null;

  // cast the numbers to string. On read, cast back if possible? or keep as string?
  @Prop({ type: String, required: false, default: null })
  volume!: string | number | null;

  @Prop({ type: String, required: false, default: null })
  issue!: string | number | null;
  @Prop({ type: String, required: false, default: null })
  pages!: string | null;

  @Prop({
    Type: Number,
    min: 1500,
    max: new Date(Date.now()).getFullYear() + 1,
    required: true,
  })
  year!: number;

  @Prop({ type: [IdentifierSchema], required: false, default: [] })
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
  @Prop({ type: [IdentifierSchema] })
  identifiers!: Identifier[];
  @Prop({ type: [CitationSchema] })
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
  @Prop({ type: String, required: true })
  firstName!: string;
  @Prop({ type: String, required: false, default: null })
  middleName!: string | null;
  @Prop({ type: String, required: true })
  lastName!: string;
}

export const PersonSchema = SchemaFactory.createForClass(Person);
