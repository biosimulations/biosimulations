import { prop } from '@typegoose/typegoose';

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
  OntologyTerm,
  Format,
  BiomodelRelationships,
  License,
  AccessLevel,
  Person,
  PrimitiveType,
  Identifier,
} from '@biosimulations/shared/datamodel';

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
  @prop()
  url!: string | null;
}

export class BiomodelVariableDB implements BiomodelVariable {
  @prop({ items: IdentiferDB, _id: false })
  identifiers!: Identifier[];
  @prop()
  target!: string;
  @prop()
  group!: string;
  @prop()
  id!: string;
  @prop()
  name!: string;
  @prop({ text: true })
  description!: string;
  @prop()
  type!: PrimitiveType;
  @prop()
  units!: string;
}
class BiomodelParameterDB implements BiomodelParameter {
  @prop()
  target!: string;
  @prop()
  group!: string;
  @prop()
  id!: string;
  @prop()
  name!: string;
  @prop()
  description!: string | null;
  @prop({ items: IdentiferDB, _id: false })
  identifiers!: Identifier[];
  @prop({ type: String })
  type!: PrimitiveType;
  @prop({ type: Object })
  value!: string | number | boolean;
  @prop({ items: Object })
  recommendedRange!: (string | number | boolean)[];
  @prop()
  units!: string;
}

export class BiomodelAttributesDB implements BiomodelAttributes {
  @prop({ required: false })
  taxon: Taxon | null;
  @prop({ required: true, items: BiomodelParameterDB, _id: false })
  parameters: BiomodelParameter[];
  @prop({ required: true, items: BiomodelVariableDB, _id: false })
  variables!: BiomodelVariableDB[];
  @prop({ required: true })
  framework: OntologyTerm;
  @prop({ required: true })
  format: Format;

  
  @prop({ required: true, _id: false })
  metadata: Attributes;

  constructor(
    taxon: Taxon | null,
    parameters: BiomodelParameter[],
    framework: OntologyTerm,
    format: Format,
    metaData: AttributesMetadata,
    variables: ModelVariable[],
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

  @prop({ required: false })
  parent: string | null = null;

  @prop({ required: false })
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
      model.attributes.variables,
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
