import {
  IOntologyTerm,
  Ontologies,
  Identifier as IIdentifier,
  IOntologyId,
  IdentifierBase as IIdentifierBase,
  OntologyInfo as IOntologyInfo,
} from '@biosimulations/datamodel/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

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

export class IdentifierBase implements IIdentifierBase {
  @ApiProperty({
    description: 'Namespace of the id',
    type: String,
    example: 'DOI',
  })
  @IsString()
  @IsNotEmpty()
  public namespace!: string;

  @ApiProperty({
    description: 'Id within the namespace',
    type: String,
    example: '10.5281/zenodo.5595241',
  })
  @IsString()
  @IsNotEmpty()
  public id!: string;
}

export class OntologyId extends IdentifierBase implements IOntologyId {
  @ApiProperty({
    description: 'Namespace of the id',
    type: String,
    enum: Ontologies,
    example: Ontologies.KISAO,
  })
  @IsEnum(Ontologies)
  public namespace!: Ontologies;

  @ApiProperty({
    description: 'Id within the namespace',
    type: String,
    example: 'KISAO_0000019',
  })
  @IsString()
  @IsNotEmpty()
  public id!: string;
}

export class Identifier extends IdentifierBase implements IIdentifier {
  @ApiProperty({
    description: 'URL for more information about the identified object',
    type: String,
    format: 'url',
    example: 'https://identifiers.org/doi/10.5281/zenodo.5595241',
  })
  @IsUrl({
    require_protocol: true,
    protocols: ['http', 'https'],
  })
  public url!: string;
}

export class OntologyIdsContainer {
  @ApiProperty({
    description: 'Identifiers of ontology terms',
    type: [OntologyId],
  })
  @ValidateNested({ each: true })
  @Type(() => OntologyId)
  ids!: OntologyId[];
}
