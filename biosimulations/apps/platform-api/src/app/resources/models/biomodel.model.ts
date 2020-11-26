import { prop } from '@typegoose/typegoose';
import isUrl from 'is-url';

import {
  IsString,
  IsBoolean,
  IsJSON,
  IsUrl,
  IsEmail,
  IsObject,
  IsMongoId,
} from 'class-validator';
import mongoose from 'mongoose';

import {
  BiomodelResource,
  ResourceType,
  BiomodelAttributes,
  PrimaryResourceMetaData,
  Taxon,
  BiomodelParameter,
  BiomodelVariable,
  IOntologyTerm,
  Format,
  BiomodelRelationships,
  License,
  AccessLevel,
  Person,
  ValueType,
  Identifier,
} from '@biosimulations/datamodel/common';

import {
  AttributesMetadata,
  ModelVariable,
  CreateModelResource,
  ExternalReferences,
} from '@biosimulations/platform/api-models';

// TODO expand definitions, add prop decorators, validation. Abstract to library. Include nested fields

export interface Attributes extends AttributesMetadata {
  license: License;
  authors: Person[];
  references: ExternalReferences;
  summary: string;
  description: string;
  tags: string[];
  accessLevel: AccessLevel;
  name: string;
}

class IdentiferDB implements Identifier {
  @prop()
  namespace!: string;

  @prop()
  id!: string;

  @prop({
    type: String,
    validate: [{
      validator: isUrl,
      message: (props: any): string => `${props.value} is not a valid URL`,
    }],
  })
  url!: string;
}

export class BiomodelVariableDB implements BiomodelVariable {
  @prop({ type: [IdentiferDB], _id: false })
  identifiers!: Identifier[];

  @prop()
  target!: string;

  @prop()
  group!: string;

  @prop()
  id!: string;

  @prop({ type: String, required: false, default: null })
  name!: string | null;

  @prop({ type: String, required: false, default: null })
  description!: string | null;

  @prop()
  type!: ValueType;

  @prop()
  units!: string;
}

// TODO: add validation that `value` and elements of `recommendedRange` are instances of `type`;
//       see other instances of ValueType for examples
class BiomodelParameterDB implements BiomodelParameter {
  @prop()
  target!: string;

  @prop()
  group!: string;

  @prop()
  id!: string;

  @prop({ type: String, required: false, default: null })
  name!: string | null;

  @prop({ type: String, required: false, default: null })
  description!: string | null;

  @prop({ type: [IdentiferDB], _id: false })
  identifiers!: Identifier[];

  @prop({ type: String })
  type!: ValueType;

  @prop({ type: String, required: false, default: null })
  value!: string | null;

  @prop({ type: [String], required: false, default: null })
  recommendedRange!: string[] | null;

  @prop()
  units!: string;
}

export class BiomodelAttributesDB implements BiomodelAttributes {
  @prop({ required: false, default: null })
  taxon: Taxon | null;

  @prop({ required: true, type: [BiomodelParameterDB], _id: false })
  parameters: BiomodelParameter[];

  @prop({ required: true, type: [BiomodelVariableDB], _id: false })
  variables!: BiomodelVariableDB[];

  @prop({ required: true })
  framework: IOntologyTerm;

  @prop({ required: true })
  format: Format;

  @prop({ required: true, _id: false })
  metadata: Attributes;

  constructor(
    taxon: Taxon | null,
    parameters: BiomodelParameter[],
    framework: IOntologyTerm,
    format: Format,
    metaData: AttributesMetadata,
    variables: ModelVariable[]
  ) {
    this.taxon = taxon;
    this.parameters = parameters;
    this.variables = variables;
    this.framework = framework;
    this.format = format;
    const created = Date.now();
    const updated = Date.now();
    const version = 1;
    const md: AttributesMetadata = {
      license: metaData.license,
      authors: metaData.authors,
      references: metaData.references,
      tags: metaData.tags,
      summary: metaData.summary,
      description: metaData.description,
      name: metaData.name,
      accessLevel: metaData.accessLevel,
    };
    this.metadata = md;
  }
}

export class Model {
  @IsMongoId()
  @prop({ required: true })
  _id: mongoose.Types.ObjectId;

  @IsString()
  @prop({ required: true, lowercase: true, trim: true, unique: true })
  id: string;

  @IsObject()
  @prop({ required: true, _id: false })
  attributes: BiomodelAttributesDB;

  @prop({ required: true })
  owner: string;

  @prop({ required: true })
  file: string;

  @prop({ required: false, default: null })
  parent: string | null = null;

  @prop({ required: false, default: null })
  image: string | null = null;

  @prop({ required: true, immutable: true })
  created: number;

  @prop({ required: true })
  updated: number;

  @prop({ required: true })
  version: number;

  constructor(model: CreateModelResource) {
    this._id = new mongoose.mongo.ObjectId();
    this.id = model.id || this._id.toHexString();
    const metadata = model.attributes.metadata;
    this.attributes = new BiomodelAttributesDB(
      model.attributes.taxon,
      model.attributes.parameters,
      model.attributes.framework,
      model.attributes.format,
      model.attributes.metadata,
      model.attributes.variables
    );
    this.created = Date.now();
    this.updated = Date.now();
    this.version = 1;
    const fileId = model.relationships?.file?.data?.id;
    const userId = model.relationships?.owner.data.id;
    const imageId = model.relationships?.image?.data?.id;
    const parentId = model.relationships?.parent?.data?.id;
    this.parent = parentId || null;
    this.owner = userId;
    this.file = fileId;
    this.image = imageId || null;
  }
}
