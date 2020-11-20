import {
  IOntologyTerm,
  Ontologies,
  Identifier as IIdentifier,
  IKisaoOntologyId,
  IEdamOntologyId,
  ISboOntologyId,
  ISioOntologyId,
  OntologyInfo as IOntologyInfo,
} from '@biosimulations/datamodel/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  EdamOntologyId,
  KisaoOntologyId,
  SboOntologyId,
  SioOntologyId,
  SpdxOntologyId,
} from './ontologyId.dto';

export class OntologyInfo implements IOntologyInfo {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  acronym!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty({ type: String, nullable: true })
  bioportalId?: string | null;

  @ApiProperty({ type: String, nullable: true })
  olsId?: string | null;

  @ApiProperty()
  version!: string;

  @ApiProperty()
  source!: string;
}

export class OntologyTerm implements IOntologyTerm {
  @ApiProperty({ enum: Ontologies })
  namespace!: Ontologies;
  @ApiProperty({ type: String })
  id!: string;
  @ApiProperty({ type: String })
  name!: string;
  @ApiProperty({ type: String, nullable: true })
  description?: string | null;
  @ApiProperty({ type: String, nullable: true })
  iri?: string | null;
  @ApiPropertyOptional({ type: String })
  url!: string;
}

export class EdamTerm extends EdamOntologyId {
  @ApiProperty()
  name!: string;
  @ApiProperty({ type: String, nullable: true })
  description?: string | null;
  @ApiProperty()
  iri!: string;
  @ApiProperty()
  url!: string;
}
export class KisaoTerm extends KisaoOntologyId {
  @ApiProperty()
  name!: string;
  @ApiProperty({ type: String, nullable: true })
  description?: string | null;
  @ApiProperty()
  iri!: string;
  @ApiProperty()
  url!: string;
}
export class SboTerm extends SboOntologyId {
  @ApiProperty()
  name!: string;
  @ApiProperty()
  description?: string | null;
  @ApiProperty()
  iri!: string;
  @ApiProperty()
  url!: string;
}
export class SioTerm extends SioOntologyId {
  @ApiProperty()
  name!: string;
  @ApiProperty({ type: String, nullable: true })
  description?: string | null;
  @ApiProperty()
  iri!: string;
  @ApiProperty()
  url!: string;
}
export class SpdxTerm extends SpdxOntologyId {
  @ApiProperty()
  name!: string;
  @ApiProperty({ type: String, nullable: true })
  description?: string | null;
  @ApiProperty()
  iri!: null;
  @ApiProperty()
  url!: string;
}
export class Identifier implements IIdentifier {
  @ApiProperty()
  namespace!: string;
  @ApiProperty()
  id!: string;
  @ApiPropertyOptional({ nullable: true, type: String, format: 'url' })
  url?: string | null;
}
