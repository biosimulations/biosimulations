import {
  IImage,
  OperatingSystemType,
  Ontologies,
} from '@biosimulations/datamodel/common';
import {
  EdamOntologyIdVersion,
  EdamOntologyDockerImageIdVersion,
} from '../common';

import { ApiProperty } from '@nestjs/swagger';

import { IsImageUrl, IsImageDigest } from '@biosimulations/datamodel/utils';

import {
  IsEnum,
  IsNotEmpty,
  ValidateNested,
  IsOptional,
} from 'class-validator';

import { Type } from 'class-transformer';

export class Image implements IImage {
  @IsImageUrl()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'URL for the image',
    example: 'ghcr.io/virtualcell/biosimulators_vcell:latest',
  })
  public url!: string;

  @IsNotEmpty()
  @IsImageDigest()
  @ApiProperty({
    type: String,
    description: 'Repository digest for the image',
    example:
      'sha256:5d1595553608436a2a343f8ab7e650798ef5ba5dab007b9fe31cd342bf18ec81',
    pattern: '^sha256:[a-z0-9]{64,64}$',
  })
  public digest!: string;

  @ValidateNested()
  @Type(() => EdamOntologyDockerImageIdVersion)
  @ApiProperty({
    type: EdamOntologyIdVersion,
    description: 'Format of the image',
    example: {
      namespace: Ontologies.EDAM,
      id: 'format_3973',
    },
  })
  public format!: EdamOntologyIdVersion;

  @IsOptional()
  @IsEnum(OperatingSystemType)
  @ApiProperty({
    type: String,
    enum: OperatingSystemType,
    nullable: true,
    description: 'Operating system in the image',
  })
  public operatingSystemType: OperatingSystemType | null = null;
}
