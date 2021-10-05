/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { ArchiveMetadata as IArchiveMetadata } from '@biosimulations/datamodel/common';

import {
  ABSTRACT,
  CITATIONS,
  CONTRIBUTORS,
  CREATED,
  CREATORS,
  DescribedIdentifier,
  DESCRIPTION,
  ENCODES,
  IDENTIFIERS,
  KEYWORDS,
  LabeledIdentifier,
  LICENCE,
  MODIFIED,
  PREDECESSORS,
  SEEALSO,
  SOURCES,
  SUCCESSORS,
  TAXA,
  TITLE,
  FUNDERS,
} from './commonDefinitions';

type IArchiveMetadataType = Omit<IArchiveMetadata, 'created' | 'modified'> & {
  created: string;
  modified: string[];
};

export class ArchiveMetadata implements IArchiveMetadataType {
  @ApiProperty({ type: 'string' })
  uri!: string; // Should this be in the API>
  @ApiPropertyOptional(TITLE)
  title?: string;
  @ApiPropertyOptional(ABSTRACT)
  abstract?: string;
  @ApiProperty(KEYWORDS)
  keywords: LabeledIdentifier[] = [];
  @ApiProperty({ type: [String] })
  thumbnails: string[] = [];
  @ApiPropertyOptional(DESCRIPTION)
  description?: string;
  @ApiProperty(TAXA)
  taxa: LabeledIdentifier[] = [];
  @ApiProperty(ENCODES)
  encodes: LabeledIdentifier[] = [];
  @ApiProperty(SOURCES)
  sources: LabeledIdentifier[] = [];
  @ApiProperty(PREDECESSORS)
  predecessors: LabeledIdentifier[] = [];
  @ApiProperty(SUCCESSORS)
  successors: LabeledIdentifier[] = [];
  @ApiProperty(SEEALSO)
  seeAlso: LabeledIdentifier[] = [];
  @ApiProperty(IDENTIFIERS)
  identifiers: LabeledIdentifier[] = [];
  @ApiProperty(CITATIONS)
  citations: LabeledIdentifier[] = [];
  @ApiProperty(CREATORS)
  creators: LabeledIdentifier[] = [];
  @ApiProperty(CONTRIBUTORS)
  contributors: LabeledIdentifier[] = [];
  @ApiPropertyOptional(LICENCE)
  license?: LabeledIdentifier[];
  @ApiProperty(FUNDERS)
  funders: LabeledIdentifier[] = [];
  @ApiProperty(CREATED)
  created!: string;
  @ApiProperty(MODIFIED)
  modified: string[] = [];
  @ApiProperty({ type: [DescribedIdentifier] })
  other: DescribedIdentifier[] = [];
}

export class ArchiveMetadataInput extends OmitType(ArchiveMetadata, [
  'created',
  'modified',
] as const) {}

export class ArchiveMetadataContainer {
  @ApiProperty({ type: [ArchiveMetadata] })
  metadata!: ArchiveMetadata[];
}
export class ArchiveMetadataInputContainer {
  @ApiProperty({ type: [ArchiveMetadataInput] })
  metadata!: ArchiveMetadataInput[];
}
