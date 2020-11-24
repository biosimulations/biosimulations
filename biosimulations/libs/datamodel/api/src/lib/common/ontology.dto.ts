import {
  IOntologyTerm,
  Ontologies,
  Identifier as IIdentifier,
  OntologyInfo as IOntologyInfo,
} from '@biosimulations/datamodel/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  EdamOntologyId,
  KisaoOntologyId,
  SboOntologyId,
  SioOntologyId,
  SpdxId,
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
  @ApiProperty({ enum: Ontologies })
  namespace!: Ontologies;

  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ type: String, nullable: true })
  description!: string | null;

  @ApiProperty({ type: String, nullable: true, format: 'url' })
  iri!: string | null;

  @ApiProperty({ type: String, format: 'url' })
  url!: string;

  @ApiProperty({ type: String, format: 'url' })
  moreInfoUrl!: string | null;
}

export class EdamTerm extends EdamOntologyId {
  @ApiProperty()
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

export class KisaoTerm extends KisaoOntologyId {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  description!: string | null;

  @ApiProperty({ type: String, format: 'url' })
  iri!: string;

  @ApiProperty({ type: String, format: 'url' })
  url!: string;

  @ApiProperty({ type: String, format: 'url' })
  moreInfoUrl!: string | null;
}

export class SboTerm extends SboOntologyId {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  description!: string | null;

  @ApiProperty({ type: String, format: 'url' })
  iri!: string;

  @ApiProperty({ type: String, format: 'url' })
  url!: string;

  @ApiProperty({ type: String, format: 'url' })
  moreInfoUrl!: string | null;
}

export class SioTerm extends SioOntologyId {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  description!: string | null;

  @ApiProperty({ type: String, format: 'url' })
  iri!: string;

  @ApiProperty({ type: String, format: 'url' })
  url!: string;

  @ApiProperty({ type: String, format: 'url' })
  moreInfoUrl!: string | null;
}

export class SpdxTerm extends SpdxId {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  description!: null;

  @ApiProperty()
  iri!: null;

  @ApiProperty({ type: String, format: 'url' })
  url!: string;

  @ApiProperty({ type: String, format: 'url' })
  moreInfoUrl!: string | null;
}

export class Identifier implements IIdentifier {
  @ApiProperty()
  namespace!: string;

  @ApiProperty()
  id!: string;

  @ApiProperty({ type: String, format: 'url' })
  url!: string;
}
