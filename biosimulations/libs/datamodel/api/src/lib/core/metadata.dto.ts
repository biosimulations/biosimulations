import { ApiProperty, OmitType } from '@nestjs/swagger';

import { License, AccessLevel } from '@biosimulations/datamodel/core';

import { Person, ExternalReferences } from '../common/index';

export class AttributesMetadata {
  @ApiProperty({ enum: () => License })
  license!: License;
  @ApiProperty({ type: () => [Person] })
  authors!: Person[];
  @ApiProperty({ type: () => ExternalReferences })
  references!: ExternalReferences;
  @ApiProperty()
  summary!: string;
  @ApiProperty()
  description!: string;
  @ApiProperty()
  tags!: string[];
  @ApiProperty({ enum: () => AccessLevel })
  accessLevel!: AccessLevel;
  @ApiProperty()
  name!: string;
}
export class ResourceMetadata {
  @ApiProperty()
  created!: number;
  @ApiProperty()
  updated!: number;
  @ApiProperty()
  version!: number;
}
