/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArchiveMetadata as IArchiveMetadata } from '@biosimulations/datamodel/common';
import {
  IsString,
  IsOptional,
  ValidateNested,
  IsArray,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

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

export class ArchiveMetadata implements IArchiveMetadata {
  @ApiProperty({ type: 'string' })
  @IsString()
  uri!: string; // Should this be in the API

  @ApiPropertyOptional(TITLE)
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional(ABSTRACT)
  @IsOptional()
  @IsString()
  abstract?: string;

  @ApiProperty(KEYWORDS)
  @ValidateNested({ each: true })
  @Type(() => LabeledIdentifier)
  keywords: LabeledIdentifier[] = [];

  @ApiProperty({ type: [String] })
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  @IsArray()
  thumbnails: string[] = [];

  @ApiPropertyOptional(DESCRIPTION)
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty(TAXA)
  @ValidateNested({ each: true })
  @Type(() => LabeledIdentifier)
  taxa: LabeledIdentifier[] = [];

  @ApiProperty(ENCODES)
  @ValidateNested({ each: true })
  @Type(() => LabeledIdentifier)
  encodes: LabeledIdentifier[] = [];

  @ApiProperty(SOURCES)
  @ValidateNested({ each: true })
  @Type(() => LabeledIdentifier)
  sources: LabeledIdentifier[] = [];

  @ApiProperty(PREDECESSORS)
  @ValidateNested({ each: true })
  @Type(() => LabeledIdentifier)
  predecessors: LabeledIdentifier[] = [];

  @ApiProperty(SUCCESSORS)
  @ValidateNested({ each: true })
  @Type(() => LabeledIdentifier)
  successors: LabeledIdentifier[] = [];

  @ApiProperty(SEEALSO)
  @ValidateNested({ each: true })
  @Type(() => LabeledIdentifier)
  seeAlso: LabeledIdentifier[] = [];

  @ApiProperty(IDENTIFIERS)
  @ValidateNested({ each: true })
  @Type(() => LabeledIdentifier)
  identifiers: LabeledIdentifier[] = [];

  @ApiProperty(CITATIONS)
  @ValidateNested({ each: true })
  @Type(() => LabeledIdentifier)
  citations: LabeledIdentifier[] = [];

  @ApiProperty(CREATORS)
  @ValidateNested({ each: true })
  @Type(() => LabeledIdentifier)
  creators: LabeledIdentifier[] = [];

  @ApiProperty(CONTRIBUTORS)
  @ValidateNested({ each: true })
  @Type(() => LabeledIdentifier)
  contributors: LabeledIdentifier[] = [];

  @ApiPropertyOptional(LICENCE)
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => LabeledIdentifier)
  license?: LabeledIdentifier[];

  @ApiProperty(FUNDERS)
  @ValidateNested({ each: true })
  @Type(() => LabeledIdentifier)
  funders: LabeledIdentifier[] = [];

  @ApiProperty(CREATED)
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  created?: string;

  @ApiProperty(MODIFIED)
  @IsOptional()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  @IsArray()
  modified?: string[];

  @ApiProperty({ type: [DescribedIdentifier] })
  @ValidateNested({ each: true })
  @Type(() => DescribedIdentifier)
  other: DescribedIdentifier[] = [];
}

export class ArchiveMetadataContainer {
  @ApiProperty({ type: [ArchiveMetadata] })
  @ValidateNested({ each: true })
  @Type(() => ArchiveMetadata)
  metadata!: ArchiveMetadata[];
}
