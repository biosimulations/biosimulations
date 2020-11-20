import {
  IOntologyTerm,
  Ontologies,
  Identifier as IIdentifier,
} from '@biosimulations/datamodel/common';
import { ApiProperty } from '@nestjs/swagger';

export class OntologyTerm implements IOntologyTerm {
  @ApiProperty({ enum: Ontologies })
  namespace!: Ontologies;
  @ApiProperty()
  id!: string;
  @ApiProperty({ type: String })
  name!: string;
  @ApiProperty({ type: String, nullable: true })
  description!: string | null;
  @ApiProperty({ type: String, nullable: true })
  iri!: string | null;
  @ApiProperty({ type: String })
  url!: string;
}

export class Identifier implements IIdentifier {
  @ApiProperty()
  namespace!: string;
  @ApiProperty()
  id!: string;
  @ApiProperty({ type: String, nullable: true })
  url!: string | null;
}
