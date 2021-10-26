import { Citation as IJournalReference } from '@biosimulations/datamodel/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Identifier } from './ontology.dto';

export class Citation implements IJournalReference {
  @IsString()
  @ApiProperty({
    type: String,
    example:
      'Bilal Shaikh, Gnaneswara Marupilla, Mike Wilson, Michael L Blinov, Ion I Moraru, Jonathan R Karr',
  })
  public authors!: string;

  @IsString()
  @ApiProperty({
    type: String,
    example:
      'RunBioSimulations: an extensible web application that simulates a wide range of computational modeling frameworks, algorithms, and formats',
  })
  public title!: string;

  @ApiProperty({
    type: String,
    nullable: true,
    required: false,
    default: null,
    example: 'Nucleic Acids Research',
  })
  @IsString()
  @IsOptional()
  public journal!: string | null;

  @ApiProperty({
    type: String,
    nullable: true,
    required: false,
    default: null,
    example: 'Volume 49',
  })
  @IsString()
  @IsOptional()
  public volume!: string | null;

  @ApiProperty({
    type: String,
    nullable: true,
    required: false,
    default: null,
    example: 'W1',
  })
  @IsString()
  @IsOptional()
  public issue!: string | null;

  @ApiProperty({
    type: 'string',
    nullable: true,
    required: false,
    default: null,
    example: 'W597–W602',
  })
  @IsString()
  @IsOptional()
  public pages!: string | null;

  @ApiProperty({ type: Number, example: 2021 })
  @IsNumber()
  public year!: number;

  @ApiProperty({
    type: [Identifier],
    example: [
      {
        namespace: 'doi',
        id: '10.1093/nar/gkab411',
        url: 'https://identifiers.org/doi/10.1093/nar/gkab411',
      },
    ],
  })
  @ValidateNested({ each: true })
  @Type(() => Identifier)
  public identifiers!: Identifier[];
}
