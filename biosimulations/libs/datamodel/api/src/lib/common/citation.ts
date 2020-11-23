import { Citation as IJournalReference } from '@biosimulations/datamodel/common';
import { ApiProperty } from '@nestjs/swagger';
import { Identifier } from './ontology.dto';

export class Citation implements IJournalReference {
  @ApiProperty()
  authors!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty({
    type: String,
    nullable: true,
    required: false,
    default: null,
  })
  journal!: string | null;

  @ApiProperty({
    type: String,
    nullable: true,
    required: false,
    default: null,
  })
  volume!: string | null;

  @ApiProperty({
    type: String,
    nullable: true,
    required: false,
    default: null,
  })
  issue!: string | null;

  @ApiProperty({
    type: 'string',
    nullable: true,
    required: false,
    default: null,
  })
  pages!: string | null;

  @ApiProperty({ example: 2020 })
  year!: number;

  @ApiProperty({
    type: [Identifier],
  })
  identifiers!: Identifier[];
}
