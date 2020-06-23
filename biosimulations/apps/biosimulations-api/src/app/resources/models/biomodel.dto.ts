import {
  ApiProperty,
  ApiExtraModels,
  OmitType,
  IntersectionType,
} from '@nestjs/swagger';

import { ResourceType } from '@biosimulations/datamodel/core';
import {
  BiomodelAttributesDTO,
  CreateBiomodelAttributesDTO,
  CreateBiomodelRelationship,
  BiomodelRelationship,
} from '@biosimulations/datamodel/api';

export class CreateBiomodelFields {
  @ApiProperty()
  attributes!: CreateBiomodelAttributesDTO;
  @ApiProperty()
  relationships!: CreateBiomodelRelationship;
}

export class ModelResource {
  @ApiProperty({ enum: ['model'] })
  type: ResourceType.model;
  @ApiProperty()
  id: string;
  @ApiProperty()
  attributes!: BiomodelAttributesDTO;
  @ApiProperty()
  relationships!: BiomodelRelationship;

  constructor(id: string, attributes: any, relationships: any) {
    this.type = ResourceType.model;
    this.id = id;
    this.attributes = attributes;
  }
}

export class CreateModelResource extends IntersectionType(
  OmitType(ModelResource, ['attributes', 'relationships'] as const),
  CreateBiomodelFields,
) {}

export class Model {
  @ApiProperty()
  data!: ModelResource;
}
export class Models {
  @ApiProperty({ type: [ModelResource] })
  data!: ModelResource[];
}
export class CreateModelDTO {
  @ApiProperty()
  data!: CreateModelResource;
}
