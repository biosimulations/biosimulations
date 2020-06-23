import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
  UserIdentifier,
  FileIdentifier,
  ModelIdentifier,
} from './identifiers.dto';
import { RelationshipObject } from './jsonApi';

export class UserRelationshipObject implements RelationshipObject {
  @ApiProperty()
  data!: UserIdentifier;
  constructor(id: string) {
    this.data = new UserIdentifier(id);
  }
}

export class NullableFileRelationshipObject implements RelationshipObject {
  @ApiProperty()
  data!: FileIdentifier | null;
  constructor(id: string | null) {
    if (id) {
      this.data = new FileIdentifier(id);
    } else {
      this.data = null;
    }
  }
}
export class FileRelationshipObject implements RelationshipObject {
  @ApiProperty()
  data!: FileIdentifier;
  constructor(id: string) {
    this.data = new FileIdentifier(id);
  }
}

export class ModelRelationshipObject implements RelationshipObject {
  @ApiProperty()
  data!: ModelIdentifier | null;
  constructor(id: string | null) {
    if (id) {
      this.data = new ModelIdentifier(id);
    } else {
      this.data = null;
    }
  }
}
