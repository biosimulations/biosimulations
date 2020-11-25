import { ExternalReferences as IExternalReferences } from '@biosimulations/datamodel/common';
import { Identifier } from './ontology.dto';
import { Citation } from './citation';
import { ApiProperty } from '@nestjs/swagger';

export class ExternalReferences implements IExternalReferences {
  @ApiProperty({ type: [Identifier] })
  identifiers!: Identifier[];

  @ApiProperty({ type: [Citation] })
  citations!: Citation[];
}
