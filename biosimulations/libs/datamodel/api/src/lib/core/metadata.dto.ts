import { ApiProperty, OmitType } from '@nestjs/swagger';

import { License, AccessLevel } from '@biosimulations/datamodel/core';

import { Person, ExternalReferences } from '../common/index';

export class ResourceMetadata {
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
  createdDate!: number;
  @ApiProperty()
  updatedDate!: number;
  @ApiProperty()
  version!: number;
  @ApiProperty()
  name!: string;
}

export class CreateResourceMetaData extends OmitType(ResourceMetadata, [
  'createdDate',
  'updatedDate',
  'version',
] as const) {}
