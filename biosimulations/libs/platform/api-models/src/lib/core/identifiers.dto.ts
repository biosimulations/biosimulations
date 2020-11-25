import { ApiProperty } from '@nestjs/swagger';
import { ResourceIdentifier } from './jsonApi';
import { ResourceType } from '@biosimulations/datamodel/common';

export class UserIdentifier implements ResourceIdentifier {
  @ApiProperty({ type: String, enum: ['user'] })
  type: ResourceType.user = ResourceType.user;

  @ApiProperty({ type: String })
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}

export class FileIdentifier implements ResourceIdentifier {
  @ApiProperty({ type: String, enum: ['file'] })
  type: ResourceType.file = ResourceType.file;

  @ApiProperty({ type: String })
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}

export class ModelIdentifier implements ResourceIdentifier {
  @ApiProperty({ type: String, enum: ['model'] })
  type: ResourceType.model = ResourceType.model;

  @ApiProperty({ type: String })
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}
