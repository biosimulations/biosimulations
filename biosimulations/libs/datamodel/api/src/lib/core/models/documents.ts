import {
  DataDocument,
  ResourceObject,
  Relationships,
  RelationshipObject,
  ResourceIdentifier,
} from '../jsonApi';
import {
  ResourceType,
  BiomodelAttributes,
} from '@biosimulations/datamodel/core';

import {
  FileRelationshipObject,
  ModelRelationshipObject,
  UserRelationshipObject,
  NullableFileRelationshipObject,
} from '../relationships.dto';
import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  IntersectionType,
  ApiExtraModels,
} from '@nestjs/swagger';
import { ModelAttributes, CreateModelAttributes } from '../biomodels.dto';
import { CreateResourceMetaData } from '../metadata.dto';

export class ModelRelationships implements Relationships {
  [key: string]: RelationshipObject;
  @ApiProperty()
  owner: UserRelationshipObject;

  @ApiProperty()
  file: FileRelationshipObject;

  @ApiPropertyOptional()
  image: NullableFileRelationshipObject;

  @ApiPropertyOptional()
  parent: ModelRelationshipObject;
  constructor(
    owner: string,
    file: string,
    image: string | null,
    parent: string | null,
  ) {
    this.owner = new UserRelationshipObject(owner);
    this.file = new FileRelationshipObject(file);
    this.image = new NullableFileRelationshipObject(image);
    this.parent = new ModelRelationshipObject(parent);
  }
}

export class ModelRelationshipIds {
  owner!: string;
  file!: string;
  image!: string | null;
  parent!: string | null;
}
export class ModelResource implements ResourceObject {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: ['model'] })
  type: ResourceType.model = ResourceType.model;

  @ApiProperty()
  attributes: ModelAttributes;
  @ApiProperty()
  relationships: ModelRelationships;
  @ApiPropertyOptional()
  links?: any;
  @ApiPropertyOptional()
  meta?: any;

  constructor(
    id: string,
    attributes: ModelAttributes,
    relationships: ModelRelationshipIds,
  ) {
    this.id = id;
    this.attributes = attributes;
    this.relationships = new ModelRelationships(
      relationships.owner,
      relationships.file,
      relationships.image,
      relationships.parent,
    );
  }
}
class CreateAttributesField {
  @ApiProperty()
  attributes!: CreateModelAttributes;
}
export class CreateModelResource extends IntersectionType(
  OmitType(ModelResource, ['attributes']),
  CreateAttributesField,
) {}
export class ModelsDocument implements DataDocument {
  @ApiProperty({ type: [ModelResource] })
  data!: ModelResource[];
}

export class CreateModelDocument {
  @ApiProperty({ type: () => CreateModelResource })
  data!: CreateModelResource;
}

@ApiExtraModels(ModelResource)
export class ModelDocument {
  @ApiProperty({ type: () => ModelResource })
  data!: ModelResource;
}
