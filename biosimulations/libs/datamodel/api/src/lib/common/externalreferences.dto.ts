import { ExternalReferences } from '@biosimulations/datamodel/core';
import { IdentifierDTO } from './ontology.dto';
import { JournalReferenceDTO } from './journalreference';
import { ApiProperty } from '@nestjs/swagger';

export class ExternalReferencesDTO implements ExternalReferences {
  @ApiProperty({ type: [IdentifierDTO] })
  identifiers!: IdentifierDTO[];
  @ApiProperty({ type: [JournalReferenceDTO] })
  references!: JournalReferenceDTO[];
  @ApiProperty({ type: String, nullable: true })
  DOI!: string | null;
}
