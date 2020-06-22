import { prop } from '@typegoose/typegoose';

import {
  IsString,
  IsBoolean,
  IsJSON,
  IsUrl,
  IsEmail,
  IsObject,
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
import { CreateBiomodelResource } from './biomodel.dto';
import {
  MetadataDTO,
  BiomodelVariableDTO,
  CreateMetaDataDTO,
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
  @prop({ required: true })
  metaData: MetadataDTO;

  constructor(
    taxon: Taxon,
    parameters: BiomodelParameter[],
    framework: OntologyTerm,
    format: Format,
    metaData: MetadataDTO | CreateMetaDataDTO,
    variables: BiomodelVariableDTO[],
  ) {
    this.taxon = taxon;
    this.parameters = parameters;
    this.variables = variables;
    this.framework = framework;
    this.format = format;
    let createdDate = Date.now();
    let version = 1;
    if ((metaData as MetadataDTO).createdDate) {
      createdDate = (metaData as MetadataDTO).createdDate;
    }
    if ((metaData as MetadataDTO).version) {
      version = version + 1;
    }

    const md: MetadataDTO = {
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
    this.metaData = md;
  }
}
export class BiomodelDB {
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

  constructor(model: CreateBiomodelResource) {
    this._id = new mongoose.mongo.ObjectId();
    this.id = model.id || this._id.toHexString();
    this.attributes.metaData = model.attributes.metadata;
    this.attributes = model.attributes;
    const fileId = model.relationships.file.data.id;
    const userId = model.relationships.owner.data.id;
    const imageId = model.relationships.image.data.id;
    const parentId = model.relationships?.parent?.data?.id;
    this.parent = parentId || null;
    this.owner = userId;
    this.file = fileId;
    this.image = imageId;
  }
}
