import {
  OntologyTerm,
  Ontologies,
  Identifier,
} from '@biosimulations/datamodel/core';
import { ApiProperty } from '@nestjs/swagger';

export class OntologyTermDTO implements OntologyTerm {
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

export class IdentifierDTO implements Identifier {
  @ApiProperty()
  namespace!: string;
  @ApiProperty()
  id!: string;
  @ApiProperty({ type: String, nullable: true })
  url!: string | null;

  serialize(): Identifier {
    return { namespace: this.namespace, id: this.id, url: this.url };
  }
}
