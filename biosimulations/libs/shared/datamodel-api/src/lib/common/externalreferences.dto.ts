import { ExternalReferences as IExternalReferences } from '@biosimulations/shared/datamodel';
import { Identifier } from './ontology.dto';
import { JournalReference } from './journalreference';
import { ApiProperty } from '@nestjs/swagger';

export class ExternalReferences implements IExternalReferences {
  @ApiProperty({ type: [Identifier] })
  identifiers!: Identifier[];
  @ApiProperty({ type: [JournalReference] })
  citations!: JournalReference[];
}
