import { ApiProperty, OmitType } from '@nestjs/swagger';

import {
  License,
  ExternalReferences,
  AccessInfo,
  PrimaryResourceMetaData,
  AccessLevel,
} from '@biosimulations/datamodel/core';

import { PersonDTO, ExternalReferencesDTO } from '../..';

export class MetadataDTO {
  @ApiProperty({ enum: License })
  license!: License;
  @ApiProperty()
  authors!: PersonDTO[];
  @ApiProperty()
  references!: ExternalReferencesDTO;
  @ApiProperty()
  summary!: string;
  @ApiProperty()
  description!: string;
  @ApiProperty()
  tags!: string[];
  @ApiProperty({ enum: AccessLevel })
  accessLevel!: AccessLevel;
  @ApiProperty()
  createdDate!: number;
  @ApiProperty()
  updatedDate!: number;
  @ApiProperty()
  version!: number;
  @ApiProperty()
  parent!: string;
  @ApiProperty()
  children!: string[];
  @ApiProperty()
  name!: string;
}
export class CreateMetaDataDTO extends OmitType(MetadataDTO, [
  'createdDate',
  'updatedDate',
  'version',
  'children',
] as const) {}
