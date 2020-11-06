import { ApiProperty } from '@nestjs/swagger';
import { ResourceIdentifier } from './jsonApi';
import { ResourceType } from '@biosimulations/datamodel/common';

export class UserIdentifier implements ResourceIdentifier {
  @ApiProperty({ enum: ['user'] })
  type: ResourceType.user = ResourceType.user;
  @ApiProperty()
  id: string;
  constructor(id: string) {
    this.id = id;
  }
}
export class FileIdentifier implements ResourceIdentifier {
  @ApiProperty({ enum: ['file'] })
  type: ResourceType.file = ResourceType.file;
  @ApiProperty()
  id: string;
  constructor(id: string) {
    this.id = id;
  }
}

export class ModelIdentifier implements ResourceIdentifier {
  @ApiProperty({ enum: ['model'] })
  type: ResourceType.model = ResourceType.model;
  @ApiProperty()
  id: string;
  constructor(id: string) {
    this.id = id;
  }
}
