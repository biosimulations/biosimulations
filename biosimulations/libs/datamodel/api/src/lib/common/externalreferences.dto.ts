import { ExternalReferences as IExternalReferences } from '@biosimulations/datamodel/core';
import { Identifier } from './ontology.dto';
import { JournalReference } from './journalreference';
import { ApiProperty } from '@nestjs/swagger';

export class ExternalReferences implements IExternalReferences {
  @ApiProperty({ type: [Identifier] })
  identifiers!: Identifier[];
  @ApiProperty({ type: [JournalReference] })
  citations!: JournalReference[];
  @ApiProperty({ type: String, nullable: true })
  doi!: string | null;
}
