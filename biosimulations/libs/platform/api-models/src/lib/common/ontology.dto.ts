import {
  IOntologyTerm,
  Ontologies,
  Identifier as IIdentifier,
} from '@biosimulations/datamodel/common';
import { ApiProperty } from '@nestjs/swagger';

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

export class Identifier implements IIdentifier {
  @ApiProperty({ type: String })
  namespace!: string;

  @ApiProperty({ type: String })
  id!: string;

  @ApiProperty({ type: String, format: 'url' })
  url!: string;
}
