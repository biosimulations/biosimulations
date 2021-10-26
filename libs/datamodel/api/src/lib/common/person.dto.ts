import { Person as IPerson } from '@biosimulations/datamodel/common';
import { Identifier } from './ontology.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class Person implements IPerson {
  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, nullable: true, required: false, default: null })
  public firstName!: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, nullable: true, required: false, default: null })
  public middleName!: string | null;

  @IsString()
  @ApiProperty({ type: String })
  public lastName!: string;

  @ValidateNested({ each: true })
  @Type(() => Identifier)
  @ApiProperty({
    type: [Identifier],
    example: [
      {
        namespace: 'orcid',
        id: '0000-0001-5801-5510',
        url: 'https://orcid.org/0000-0001-5801-5510',
      },
    ],
  })
  public identifiers!: Identifier[];
}
