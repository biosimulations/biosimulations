import {
  OntologyTerm as IOntologyTerm,
  Ontologies,
  Identifier as IIdentifier,
} from '@biosimulations/datamodel/core';
import { ApiProperty } from '@nestjs/swagger';

export class OntologyTerm implements OntologyTerm {
  @ApiProperty({ enum: Ontologies })
  ontology!: string;
  @ApiProperty()
  id!: string;
  @ApiProperty()
  name!: string;
  @ApiProperty({ type: String, nullable: true })
  description!: string | null;
  @ApiProperty({ type: String, nullable: true })
  iri!: string | null;
}

export class Identifier implements IIdentifier {
  @ApiProperty()
  namespace!: string;
  @ApiProperty()
  id!: string;
  @ApiProperty({ type: String, nullable: true })
  url!: string | null;
}
