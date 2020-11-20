import { Citation as IJournalReference } from '@biosimulations/datamodel/common';
import { ApiProperty, ApiExtraModels, OmitType } from '@nestjs/swagger';
import { Identifier } from './ontology.dto';

export class Citation implements IJournalReference {
  @ApiProperty()
  authors!: string;
  @ApiProperty()
  title!: string;
  @ApiProperty({ type: String, nullable: true, required: false, default: null })
  journal!: string | null;
  @ApiProperty({
    oneOf: [{ type: 'string' }, { type: 'number' }],
    nullable: true,
    required: false,
    default: null,
  })
  volume!: string | number | null;
  @ApiProperty({
    oneOf: [{ type: 'string' }, { type: 'number' }],
    nullable: true,
    required: false,
    default: null,
  })
  issue!: string | number | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
    required: false,
    default: null,
  })
  pages!: string | null;
  @ApiProperty({ example: 2020 })
  year!: number;
  @ApiProperty({ type: String, nullable: true, required: false, default: [] })
  identifiers!: Identifier[];
}
