import { Person as IPerson } from '@biosimulations/datamodel/common';
import { Identifier } from '@biosimulations/datamodel/api';
import { ApiProperty } from '@nestjs/swagger';

export class Person implements IPerson {
  @ApiProperty({ type: String, nullable: true, required: false, default: null })
  firstName!: string | null;

  @ApiProperty({ type: String, nullable: true, required: false, default: null })
  middleName!: string | null;

  @ApiProperty()
  lastName!: string;

  @ApiProperty({ type: [Identifier] })
  identifiers!: Identifier[];
}
