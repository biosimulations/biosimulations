import { Person as IPerson } from '@biosimulations/datamodel/common';
import { ApiProperty } from '@nestjs/swagger';

export class Person implements IPerson {
  @ApiProperty()
  firstName!: string;
  @ApiProperty({ type: String, nullable: true, required: false, default: null })
  middleName!: string | null;
  @ApiProperty()
  lastName!: string;
}
