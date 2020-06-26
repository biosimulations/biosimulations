import { prop } from '@typegoose/typegoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
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
  BiomodelAttributes as IAttributes,
  PrimaryResourceMetaData,
  Taxon as ITaxon,
  BiomodelParameter,
  BiomodelVariable,
  OntologyTerm,
  Format,
  BiomodelRelationships,
} from '@biosimulations/datamodel/core';

import {
  MetadataDTO,
  BiomodelVariableDTO,
  CreateMetaDataDTO,
  CreateBiomodelResource,
} from '@biosimulations/datamodel/api';

export class Taxon implements ITaxon {
  @prop({ required: true })
  id: number;
  @prop({ required: true })
  name: string;

  constructor(taxon: ITaxon) {
    this.id = taxon.id;
    this.name = taxon.name;
  }
}
export class BiomodelAttributes implements IAttributes {
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
    this.taxon = new Taxon(taxon);
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

  serialize(): IAttributes {
    const data: IAttributes = {
      taxon: this.taxon,
      parameters: this.parameters,
      variables: this.variables,
      framework: this.framework,
      format: this.format,
    };
    return data;
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

  constructor(model: CreateBiomodelResource) {
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
