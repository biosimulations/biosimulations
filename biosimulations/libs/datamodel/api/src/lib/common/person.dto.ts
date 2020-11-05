import { Person as IPerson } from '@biosimulations/shared/datamodel';
import { ApiProperty } from '@nestjs/swagger';

export class Person implements IPerson {
  @ApiProperty()
  firstName!: string;
  @ApiProperty({ type: String, nullable: true })
  middleName!: string | null;
  @ApiProperty()
  lastName!: string;
}
