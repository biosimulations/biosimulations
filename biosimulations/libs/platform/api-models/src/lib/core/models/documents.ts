import {
  DataDocument,
  ResourceObject,
  Relationships,
  RelationshipObject,
} from '../jsonApi';
import { ResourceType } from '@biosimulations/datamodel/common';

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
  ApiExtraModels,
} from '@nestjs/swagger';
import { ModelAttributes } from '../biomodels.dto';
import { ResourceMetadata } from '../metadata.dto';

export class ModelRelationships implements Relationships {
  [key: string]: RelationshipObject;
  @ApiProperty({ type: UserRelationshipObject })
  owner: UserRelationshipObject;

  @ApiProperty({ type: FileRelationshipObject })
  file: FileRelationshipObject;

  @ApiPropertyOptional({ type: NullableFileRelationshipObject })
  image: NullableFileRelationshipObject;

  @ApiPropertyOptional({ type: ModelRelationshipObject })
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
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String, enum: ['model'] })
  type: ResourceType.model = ResourceType.model;

  @ApiProperty({ type: ModelAttributes })
  attributes: ModelAttributes;

  @ApiProperty({ type: ModelRelationships })
  relationships: ModelRelationships;

  @ApiProperty({ type: Object })
  links?: any;

  @ApiProperty({ type: ResourceMetadata })
  meta: ResourceMetadata;

  constructor(
    id: string,
    attributes: ModelAttributes,
    relationships: ModelRelationshipIds,
    metadata: ResourceMetadata,
  ) {
    this.id = id;
    this.attributes = attributes;
    this.relationships = new ModelRelationships(
      relationships.owner,
      relationships.file,
      relationships.image,
      relationships.parent,
    );
    this.meta = metadata;
  }
}

export class CreateModelResource extends OmitType(ModelResource, ['meta']) {}
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
