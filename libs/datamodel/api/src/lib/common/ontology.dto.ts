import {
  IOntologyTerm,
  Ontologies,
  Identifier as IIdentifier,
  OntologyInfo as IOntologyInfo,
} from '@biosimulations/datamodel/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  Allow,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import {
  EdamOntologyId,
  FunderRegistryOntologyId,
  LinguistOntologyId,
  KisaoOntologyId,
  SboOntologyId,
  SioOntologyId,
  SpdxOntologyId,
} from './ontologyId.dto';

export class OntologyInfo implements IOntologyInfo {
  @ApiProperty({ type: String, nullable: true })
  public id!: string | null;

  @ApiProperty({ type: String, nullable: true })
  public acronym!: string | null;

  @ApiProperty({ type: String })
  public name!: string;

  @ApiProperty({ type: String })
  public description!: string;

  @ApiProperty({ type: String, nullable: true })
  public bioportalId!: string | null;

  @ApiProperty({ type: String, nullable: true })
  public olsId!: string | null;

  @ApiProperty({ type: String, nullable: true })
  public version!: string | null;

  @ApiProperty({ type: String })
  public source!: string;
}

export class OntologyTerm implements IOntologyTerm {
  @ApiProperty({ type: String, enum: Ontologies })
  public namespace!: Ontologies;

  @ApiProperty({ type: String })
  public id!: string;

  @ApiProperty({ type: String, nullable: true })
  public name!: string | null;

  @ApiProperty({ type: String, nullable: true })
  public description!: string | null;

  @ApiProperty({ type: String, nullable: true, format: 'url' })
  public iri!: string | null;

  @ApiProperty({ type: String, nullable: true, format: 'url' })
  public url!: string | null;

  @ApiProperty({ type: String, nullable: true, format: 'url' })
  public moreInfoUrl!: string | null;
}

export class EdamTerm extends EdamOntologyId {
  @ApiProperty({ type: String })
  public name!: string;

  @ApiProperty({ type: String, nullable: true })
  public description!: string | null;

  @ApiProperty({ type: String, format: 'url' })
  public iri!: string;

  @ApiProperty({ type: String, format: 'url' })
  public url!: string;

  @ApiProperty({ type: String, format: 'url' })
  public moreInfoUrl!: string | null;
}

export class FunderRegistryTerm extends FunderRegistryOntologyId {
  @ApiProperty({ type: String })
  public name!: string;

  @ApiProperty({ type: typeof null, nullable: true })
  public description!: null;

  @ApiProperty({ type: typeof null, nullable: true })
  public iri!: null;

  @ApiProperty({ type: String })
  public url!: string;

  @ApiProperty({ type: typeof null, nullable: true })
  public moreInfoUrl!: null;
}

export class LinguistTerm extends LinguistOntologyId {
  @ApiProperty({ type: typeof null, nullable: true })
  public name!: null;

  @ApiProperty({ type: typeof null, nullable: true })
  public description!: null;

  @ApiProperty({ type: typeof null, nullable: true })
  public iri!: null;

  @ApiProperty({ type: typeof null, nullable: true })
  public url!: null;

  @ApiProperty({ type: typeof null, nullable: true })
  public moreInfoUrl!: null;
}

export class KisaoTerm extends KisaoOntologyId {
  @ApiProperty({ type: String })
  public name!: string;

  @ApiProperty({ type: String })
  public description!: string | null;

  @ApiProperty({ type: String, format: 'url' })
  public iri!: string;

  @ApiProperty({ type: String, format: 'url' })
  public url!: string;

  @ApiProperty({ type: String, format: 'url' })
  public moreInfoUrl!: string | null;
}

export class SboTerm extends SboOntologyId {
  @ApiProperty({ type: String })
  public name!: string;

  @ApiProperty({ type: String })
  public description!: string | null;

  @ApiProperty({ type: String, format: 'url' })
  public iri!: string;

  @ApiProperty({ type: String, format: 'url' })
  public url!: string;

  @ApiProperty({ type: String, format: 'url' })
  public moreInfoUrl!: string | null;
}

export class SioTerm extends SioOntologyId {
  @ApiProperty({ type: String })
  public name!: string;

  @ApiProperty({ type: String })
  public description!: string | null;

  @ApiProperty({ type: String, format: 'url' })
  public iri!: string;

  @ApiProperty({ type: String, format: 'url' })
  public url!: string;

  @ApiProperty({ type: String, format: 'url' })
  public moreInfoUrl!: string | null;
}

export class SpdxTerm extends SpdxOntologyId {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  public name!: string;

  @Allow()
  @ApiProperty({ type: typeof null, nullable: true })
  public description!: null;

  @Allow()
  @ApiProperty({ type: typeof null, nullable: true })
  public iri!: null;

  @IsUrl({ require_protocol: true })
  @ApiProperty({ type: String, format: 'url' })
  public url!: string;

  @IsUrl({
    require_valid_protocol: true,
    require_protocol: true,
  })
  @IsOptional()
  @ApiProperty({ type: String, format: 'url' })
  public moreInfoUrl!: string | null;
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

  // TODO verify this level of validation is correct (require protocol, require valid protocol, require host)
  @IsUrl({ require_protocol: true, require_host: true })
  @ApiProperty({ type: String, format: 'url', example: 'https://identifiers.org/doi/10.5281/zenodo.5595241' })
  public url!: string;
}
