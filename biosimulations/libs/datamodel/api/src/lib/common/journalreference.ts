import { JournalReference } from '@biosimulations/datamodel/core';
import { ApiProperty, ApiExtraModels, OmitType } from '@nestjs/swagger';

export class JournalReferenceDTO implements JournalReference {
  @ApiProperty()
  authors!: string;
  @ApiProperty()
  title!: string;
  @ApiProperty()
  journal!: string;
  @ApiProperty({
    oneOf: [{ type: 'string' }, { type: 'number' }],
    nullable: true,
  })
  volume!: string | number | null;
  @ApiProperty({
    oneOf: [{ type: 'string' }, { type: 'number' }],
    nullable: true,
  })
  issue!: string | number | null;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  pages!: string | null;
  @ApiProperty()
  year!: number;
  @ApiProperty()
  doi!: string | null;
}
