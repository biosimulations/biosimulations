import {
  IOntologyId,
  Ontologies,
  IEdamOntologyId,
  IEdamOntologyIdVersion,
  IFunderRegistryOntologyId,
  ILinguistOntologyId,
  IKisaoOntologyId,
  ISboOntologyId,
  ISioOntologyId,
  ISpdxOntologyId,
} from '@biosimulations/datamodel/common';
import { ApiProperty } from '@nestjs/swagger';

export class OntologyId implements IOntologyId {
  @ApiProperty({ type: String, enum: Ontologies, enumName: 'Ontologies' })
  namespace!: Ontologies;

  @ApiProperty({ type: String })
  id!: string;
}

export class EdamOntologyId implements IEdamOntologyId {
  @ApiProperty({ type: String, enum: [Ontologies.EDAM] })
  namespace!: Ontologies.EDAM;

  @ApiProperty({ type: String, example: 'format_3973' })
  id!: string;
}

export class EdamOntologyIdVersion implements IEdamOntologyIdVersion {
  @ApiProperty({ type: String, enum: [Ontologies.EDAM] })
  namespace!: Ontologies.EDAM;

  @ApiProperty({ type: String, example: 'format_3973' })
  id!: string;

  @ApiProperty({ type: String, example: 'L3V2', nullable: true })
  version!: string | null;

  @ApiProperty({
    type: [String],
    description: 'Supported features of the format',
    example: 'Plot2D',
  })
  supportedFeatures!: string[];
}

export class FunderRegistryOntologyId implements IFunderRegistryOntologyId {
  @ApiProperty({ type: String, enum: [Ontologies.FunderRegistry] })
  namespace!: Ontologies.FunderRegistry;

  @ApiProperty({
    type: String,
    example: 'http://dx.doi.org/10.13039/100000001',
  })
  id!: string;
}

export class LinguistOntologyId implements ILinguistOntologyId {
  @ApiProperty({ type: String, enum: [Ontologies.Linguist] })
  namespace!: Ontologies.Linguist;

  @ApiProperty({ type: String, example: 'Python' })
  id!: string;
}

export class KisaoOntologyId implements IKisaoOntologyId {
  @ApiProperty({ type: String, enum: [Ontologies.KISAO] })
  namespace!: Ontologies.KISAO;

  @ApiProperty({ type: String, example: 'KISAO_0000306' })
  id!: string;
}

export class SboOntologyId implements ISboOntologyId {
  @ApiProperty({ type: String, enum: [Ontologies.SBO] })
  namespace!: Ontologies.SBO;

  @ApiProperty({ type: String, example: 'SBO_0000004' })
  id!: string;
}

export class SioOntologyId implements ISioOntologyId {
  @ApiProperty({ type: String, enum: [Ontologies.SIO] })
  namespace!: Ontologies.SIO;

  @ApiProperty({ type: String, example: 'SIO_000004' })
  id!: string;
}

export class SpdxOntologyId implements ISpdxOntologyId {
  @ApiProperty({ type: String, enum: [Ontologies.SPDX] })
  namespace!: Ontologies.SPDX;

  @ApiProperty({ type: String, example: '0BSD' })
  id!: string;
}
