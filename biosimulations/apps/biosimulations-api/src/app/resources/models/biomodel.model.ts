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

export class BiomodelAttributesDB implements BiomodelAttributes {
  @prop({ required: true })
  taxon!: Taxon;
  @prop({ required: true })
  parameters!: BiomodelParameter[];
  @prop({ required: true })
  variables!: BiomodelVariable[];
  @prop({ required: true })
  framework!: OntologyTerm;
  @prop({ required: true })
  format!: Format;
}
export class BiomodelDB {
  @prop({ required: true })
  _id: mongoose.Types.ObjectId;

  @IsString()
  @prop({ required: true, unique: true })
  id: string;

  @IsObject()
  @prop({ required: true, _id: false })
  attributes: BiomodelAttributes;

  @prop({ required: true })
  owner: string;

  @prop({ required: true })
  file: string;

  @prop({ required: true })
  parent: string | null = null;

  constructor(model: CreateBiomodelResource) {
    this._id = new mongoose.mongo.ObjectId();
    this.id = model.id || this._id.toHexString();
    this.attributes = model.attributes;
    const fileId = model.relationships.file.data.id;
    const userId = model.relationships.owner.data.id;
    const parentId = model.relationships?.parent?.data?.id;
    this.parent = parentId || null;
    this.owner = userId;
    this.file = fileId;
  }
}
