import {
  IOntologyTerm,
  Ontologies,
  Identifier as IIdentifier,
  OntologyInfo as IOntologyInfo,
} from '@biosimulations/datamodel/common';
import { ApiProperty } from '@nestjs/swagger';
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
  id!: string | null;

  @ApiProperty({ type: String, nullable: true })
  acronym!: string | null;

  @ApiProperty({ type: String })
  name!: string;

  @ApiProperty({ type: String })
  description!: string;

  @ApiProperty({ type: String, nullable: true })
  bioportalId!: string | null;

  @ApiProperty({ type: String, nullable: true })
  olsId!: string | null;

  @ApiProperty({ type: String, nullable: true })
  version!: string | null;

  @ApiProperty({ type: String })
  source!: string;
}

export class OntologyTerm implements IOntologyTerm {
  @ApiProperty({ type: String, enum: Ontologies })
  namespace!: Ontologies;

  @ApiProperty({ type: String })
  id!: string;

  @ApiProperty({ type: String, nullable: true })
  name!: string | null;

  @ApiProperty({ type: String, nullable: true })
  description!: string | null;

  @ApiProperty({ type: String, nullable: true, format: 'url' })
  iri!: string | null;

  @ApiProperty({ type: String, nullable: true, format: 'url' })
  url!: string | null;

  @ApiProperty({ type: String, nullable: true, format: 'url' })
  moreInfoUrl!: string | null;
}

export class EdamTerm extends EdamOntologyId {
  @ApiProperty({ type: String })
  name!: string;

  @ApiProperty({ type: String, nullable: true })
  description!: string | null;

  @ApiProperty({ type: String, format: 'url' })
  iri!: string;

  @ApiProperty({ type: String, format: 'url' })
  url!: string;

  @ApiProperty({ type: String, format: 'url' })
  moreInfoUrl!: string | null;
}

export class FunderRegistryTerm extends FunderRegistryOntologyId {
  @ApiProperty({ type: String })
  name!: string;

  @ApiProperty({ type: typeof null, nullable: true })
  description!: null;

  @ApiProperty({ type: typeof null, nullable: true })
  iri!: null;

  @ApiProperty({ type: String })
  url!: string;

  @ApiProperty({ type: typeof null, nullable: true })
  moreInfoUrl!: null;
}

export class LinguistTerm extends LinguistOntologyId {
  @ApiProperty({ type: typeof null, nullable: true })
  name!: null;

  @ApiProperty({ type: typeof null, nullable: true })
  description!: null;

  @ApiProperty({ type: typeof null, nullable: true })
  iri!: null;

  @ApiProperty({ type: typeof null, nullable: true })
  url!: null;

  @ApiProperty({ type: typeof null, nullable: true })
  moreInfoUrl!: null;
}

export class KisaoTerm extends KisaoOntologyId {
  @ApiProperty({ type: String })
  name!: string;

  @ApiProperty({ type: String })
  description!: string | null;

  @ApiProperty({ type: String, format: 'url' })
  iri!: string;

  @ApiProperty({ type: String, format: 'url' })
  url!: string;

  @ApiProperty({ type: String, format: 'url' })
  moreInfoUrl!: string | null;
}

export class SboTerm extends SboOntologyId {
  @ApiProperty({ type: String })
  name!: string;

  @ApiProperty({ type: String })
  description!: string | null;

  @ApiProperty({ type: String, format: 'url' })
  iri!: string;

  @ApiProperty({ type: String, format: 'url' })
  url!: string;

  @ApiProperty({ type: String, format: 'url' })
  moreInfoUrl!: string | null;
}

export class SioTerm extends SioOntologyId {
  @ApiProperty({ type: String })
  name!: string;

  @ApiProperty({ type: String })
  description!: string | null;

  @ApiProperty({ type: String, format: 'url' })
  iri!: string;

  @ApiProperty({ type: String, format: 'url' })
  url!: string;

  @ApiProperty({ type: String, format: 'url' })
  moreInfoUrl!: string | null;
}

export class SpdxTerm extends SpdxOntologyId {
  @ApiProperty({ type: String })
  name!: string;

  @ApiProperty({ type: typeof null, nullable: true })
  description!: null;

  @ApiProperty({ type: typeof null, nullable: true })
  iri!: null;

  @ApiProperty({ type: String, format: 'url' })
  url!: string;

  @ApiProperty({ type: String, format: 'url' })
  moreInfoUrl!: string | null;
}

export class Identifier implements IIdentifier {
  @ApiProperty({ type: String })
  namespace!: string;

  @ApiProperty({ type: String })
  id!: string;

  @ApiProperty({ type: String, format: 'url' })
  url!: string;
}
