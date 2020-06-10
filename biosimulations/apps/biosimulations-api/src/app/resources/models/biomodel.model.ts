import { prop } from '@typegoose/typegoose';
import { IsString, IsBoolean, IsJSON, IsUrl, IsEmail } from 'class-validator';
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

export class Biomodel implements BiomodelResource {
  type: ResourceType.model = ResourceType.model;
  id: string;
  attributes: BiomodelAttributes;
  meta!: PrimaryResourceMetaData;
  relationships!: BiomodelRelationships;

  constructor(
    id: string,
    attributes: BiomodelAttributes,
    meta: PrimaryResourceMetaData,
  ) {
    this.id = id;
    this.attributes = attributes;
  }
}
