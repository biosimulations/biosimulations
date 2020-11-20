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
  @ApiProperty({ enum: Ontologies, enumName: 'Ontologies' })
  namespace!: Ontologies;
  @ApiProperty()
  id!: string;
}

export class EdamOntologyId implements IEdamOntologyId {
  @ApiProperty({ enum: ['EDAM'] })
  namespace!: Ontologies.EDAM;
  @ApiProperty({ example: 'format_3973' })
  id!: string;
}

export class KisaoOntologyId implements IKisaoOntologyId {
  @ApiProperty({ enum: ['KISAO'] })
  namespace!: Ontologies.KISAO;
  @ApiProperty({ example: 'KISAO_0000306' })
  id!: string;
}

export class SboOntologyId implements ISboOntologyId {
  @ApiProperty({ enum: ['SBO'] })
  namespace!: Ontologies.SBO;
  @ApiProperty({ example: 'SBO_0000004' })
  id!: string;
}

export class SioOntologyId implements ISioOntologyId {
  @ApiProperty({ enum: ['SIO'] })
  namespace!: Ontologies.SIO;
  @ApiProperty({ example: 'SIO_000004' })
  id!: string;
}

export class SpdxId implements ISpdxId {
  @ApiProperty({ enum: ['SPDX'] })
  namespace!: Ontologies.SPDX;
  @ApiProperty({ example: '0BSD' })
  id!: string;
}
