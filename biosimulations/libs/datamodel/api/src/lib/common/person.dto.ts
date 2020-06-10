import { Person } from '@biosimulations/datamodel/core';
import { ApiProperty } from '@nestjs/swagger';

export class PersonDTO implements Person {
  @ApiProperty()
  firstName!: string;
  @ApiProperty({ type: String, nullable: true })
  middleName!: string | null;
  @ApiProperty()
  lastName!: string;
}
