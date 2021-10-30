import {
  IOntologyTerm,
  Ontologies,
  Identifier as IIdentifier,
  OntologyInfo as IOntologyInfo,
} from '@biosimulations/datamodel/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class OntologyInfo implements IOntologyInfo {
  @ApiPropertyOptional({ type: String, nullable: true })
  public id: string | null = null;

  @ApiPropertyOptional({ type: String, nullable: true })
  public acronym: string | null = null;

  @ApiProperty({ type: String })
  public name!: string;

  @ApiProperty({ type: String })
  public description!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  public bioportalId: string | null = null;

  @ApiPropertyOptional({ type: String, nullable: true })
  public olsId: string | null = null;

  @ApiPropertyOptional({ type: String, nullable: true })
  public version: string | null = null;

  @ApiProperty({ type: String })
  public source!: string;
}

export class OntologyTerm implements IOntologyTerm {
  @ApiProperty({ type: String, enum: Ontologies })
  public namespace!: Ontologies;

  @ApiProperty({ type: String })
  public id!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  public name: string | null = null;

  @ApiPropertyOptional({ type: String, nullable: true })
  public description: string | null = null;

  @ApiPropertyOptional({ type: String, nullable: true, format: 'url' })
  public iri: string | null = null;

  @ApiPropertyOptional({ type: String, nullable: true, format: 'url' })
  public url: string | null = null;

  @ApiPropertyOptional({ type: String, nullable: true, format: 'url' })
  public moreInfoUrl: string | null = null;

  @ApiProperty({
    description: 'Identifiers of parent terms',
    type: [String],
  })
  public parents!: string[];

  @ApiProperty({
    description: 'Identifiers of child terms',
    type: [String],
  })
  public children!: string[];
}

export class Identifier implements IIdentifier {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'DOI' })
  public namespace!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: '10.5281/zenodo.5595241' })
  public id!: string;

  @IsUrl({
    require_protocol: true,
    protocols: ['http', 'https'],
  })
  @ApiProperty({
    type: String,
    format: 'url',
    example: 'https://identifiers.org/doi/10.5281/zenodo.5595241',
  })
  public url!: string;
}
