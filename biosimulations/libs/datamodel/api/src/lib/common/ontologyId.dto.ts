import {
  IOntologyId,
  Ontologies,
  IEdamOntologyId,
  IKisaoOntologyId,
  ISboOntologyId,
  ISioOntologyId,
  ISpdxId,
} from '@biosimulations/datamodel/common';
import { ApiProperty } from '@nestjs/swagger';

export class OntologyId implements IOntologyId {
  @ApiProperty({ type: String, enum: Ontologies, enumName: 'Ontologies' })
  namespace!: Ontologies;

  @ApiProperty({ type: String })
  id!: string;
}

export class EdamOntologyId implements IEdamOntologyId {
  @ApiProperty({ type: String, enum: ['EDAM'] })
  namespace!: Ontologies.EDAM;

  @ApiProperty({ type: String, example: 'format_3973' })
  id!: string;
}

export class KisaoOntologyId implements IKisaoOntologyId {
  @ApiProperty({ type: String, enum: ['KISAO'] })
  namespace!: Ontologies.KISAO;

  @ApiProperty({ type: String, example: 'KISAO_0000306' })
  id!: string;
}

export class SboOntologyId implements ISboOntologyId {
  @ApiProperty({ type: String, enum: ['SBO'] })
  namespace!: Ontologies.SBO;

  @ApiProperty({ type: String, example: 'SBO_0000004' })
  id!: string;
}

export class SioOntologyId implements ISioOntologyId {
  @ApiProperty({ type: String, enum: ['SIO'] })
  namespace!: Ontologies.SIO;

  @ApiProperty({ type: String, example: 'SIO_000004' })
  id!: string;
}

export class SpdxId implements ISpdxId {
  @ApiProperty({ type: String, enum: ['SPDX'] })
  namespace!: Ontologies.SPDX;

  @ApiProperty({ type: String, example: '0BSD' })
  id!: string;
}
