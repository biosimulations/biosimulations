import { ApiProperty } from '@nestjs/swagger';

export class UserAPIIdentifier {
  @ApiProperty({ enum: ['user'] })
  type!: 'user';
  @ApiProperty()
  id!: string;
}

export class FileAPIIdentifier {
  @ApiProperty({ enum: ['file'] })
  type!: 'file';
  @ApiProperty()
  id!: string;
}
export class ModelAPIIdentifier {
  @ApiProperty({ enum: ['model'] })
  type!: 'model';
  @ApiProperty()
  id!: string;
}
export class DataWithUserIdentifier {
  @ApiProperty()
  data!: UserAPIIdentifier;
}
export class DataWithFileIdentifier {
  @ApiProperty()
  data!: FileAPIIdentifier;
}

export class DataWithModelIdentifier {
  @ApiProperty()
  data!: ModelAPIIdentifier;
}
