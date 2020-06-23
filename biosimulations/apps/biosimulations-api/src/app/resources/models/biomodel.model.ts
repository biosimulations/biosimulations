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
import * as mongoose from 'mongoose';

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
} from '@biosimulations/datamodel/core';

import {
  ResourceMetadata,
  ModelVariable,
  CreateResourceMetaData,
  CreateModelResource,
} from '@biosimulations/datamodel/api';

export class BiomodelAttributesDB implements BiomodelAttributes {
  @prop({ required: true })
  taxon: Taxon;
  @prop({ required: true })
  parameters: BiomodelParameter[];
  @prop({ required: true })
  variables!: BiomodelVariable[];
  @prop({ required: true })
  framework: OntologyTerm;
  @prop({ required: true })
  format: Format;
  @prop({ required: true, _id: false })
  metadata: ResourceMetadata;

  constructor(
    taxon: Taxon,
    parameters: BiomodelParameter[],
    framework: OntologyTerm,
    format: Format,
    metaData: ResourceMetadata | CreateResourceMetaData,
    variables: ModelVariable[],
  ) {
    this.taxon = taxon;
    this.parameters = parameters;
    this.variables = variables;
    this.framework = framework;
    this.format = format;
    let createdDate = Date.now();
    let version = 1;
    if ((metaData as ResourceMetadata).createdDate) {
      createdDate = (metaData as ResourceMetadata).createdDate;
    }
    if ((metaData as ResourceMetadata).version) {
      version = version + 1;
    }

    const md: ResourceMetadata = {
      createdDate,
      version,
      updatedDate: Date.now(),
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
export class BiomodelDB {
  @IsMongoId()
  @prop({ required: true })
  _id: mongoose.Types.ObjectId;

  @IsString()
  @prop({ required: true, unique: true })
  id: string;

  @IsObject()
  @prop({ required: true, _id: false })
  attributes: BiomodelAttributesDB;

  @prop({ required: true })
  owner: string;

  @prop({ required: true })
  file: string;

  @prop({ required: true })
  parent: string | null = null;

  @prop({ required: true })
  image: string | null = null;

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
