import { ApiProperty, ApiExtraModels, OmitType } from '@nestjs/swagger';
import * as JSONAPI from 'jsonapi-typescript';
import * as JSON from 'json-typescript';
import { ResourceType } from '@biosimulations/datamodel/core';
import {
  BiomodelAttributesDTO,
  CreateBiomodelAttributesDTO,
} from '@biosimulations/datamodel/api';

class JsonAPIIdentifier {
  @ApiProperty()
  type!: string;
  @ApiProperty()
  id!: string;
}
class dataWithIdentifier {
  @ApiProperty()
  data!: JsonAPIIdentifier;
}
export class CreateBiomodelRelationship {
  @ApiProperty()
  owner!: dataWithIdentifier;
  @ApiProperty()
  file!: dataWithIdentifier;
}

export class CreateBiomodelResource {
  @ApiProperty({ enum: ['model'] })
  type!: ResourceType.model;
  @ApiProperty()
  id!: string;
  @ApiProperty()
  attributes!: CreateBiomodelAttributesDTO;
  @ApiProperty()
  relationships!: CreateBiomodelRelationship;
}

export class CreateBiomodelDTO {
  @ApiProperty()
  data!: CreateBiomodelResource;
}
