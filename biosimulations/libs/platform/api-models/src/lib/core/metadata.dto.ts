import { ApiProperty } from '@nestjs/swagger';

import { License, AccessLevel } from '@biosimulations/datamodel/common';

import { Person, ExternalReferences } from '../common/index';

export class AttributesMetadata {
  @ApiProperty({ type: String, enum: () => License })
  license!: License;

  @ApiProperty({ type: () => [Person] })
  authors!: Person[];

  @ApiProperty({ type: () => ExternalReferences })
  references!: ExternalReferences;

  @ApiProperty({ type: String })
  summary!: string;

  @ApiProperty({ type: String })
  description!: string;

  @ApiProperty({ type: [String] })
  tags!: string[];

  @ApiProperty({ type: String, enum: () => AccessLevel })
  accessLevel!: AccessLevel;

  @ApiProperty({ type: String })
  name!: string;
}

export class ResourceMetadata {
  @ApiProperty({ type: Number })
  created!: number;

  @ApiProperty({ type: Number })
  updated!: number;

  @ApiProperty({ type: Number })
  version!: number;
}
