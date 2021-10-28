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
import {
  Equals,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsOptional,
} from 'class-validator';

export class OntologyId implements IOntologyId {
  @IsEnum(Ontologies)
  @IsNotEmpty()
  @ApiProperty({ type: String, enum: Ontologies, enumName: 'Ontologies' })
  public namespace!: Ontologies;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  public id!: string;
}

export class EdamOntologyId extends OntologyId implements IEdamOntologyId {
  @ApiProperty({ type: String, enum: [Ontologies.EDAM] })
  public namespace!: Ontologies.EDAM;

  @ApiProperty({ type: String, example: 'format_3973' })
  public id!: string;
}

export class EdamOntologyIdVersion
  extends OntologyId
  implements IEdamOntologyIdVersion
{
  @IsString()
  @ApiProperty({ type: String, enum: [Ontologies.EDAM] })
  public namespace!: Ontologies.EDAM;

  @IsString()
  @ApiProperty({ type: String, example: 'format_3973' })
  public id!: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, example: 'L3V2', nullable: true, default: null })
  public version: string | null = null;

  @IsString({ each: true })
  @ApiProperty({
    type: [String],
    description: 'Supported features of the format',
    example: 'Plot2D',
  })
  public supportedFeatures!: string[];
}

export class EdamOntologyDockerImageIdVersion
  extends EdamOntologyIdVersion
{
  @IsString()
  @ApiProperty({ type: String, enum: [Ontologies.EDAM] })
  public namespace!: Ontologies.EDAM;

  @Equals('format_3973')
  @IsString()
  @ApiProperty({ type: String, example: 'format_3973' })
  public id!: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, example: 'L3V2', nullable: true, default: null })
  public version: string | null = null;

  @IsString({ each: true })
  @ApiProperty({
    type: [String],
    description: 'Supported features of the format',
    example: 'Plot2D',
  })
  public supportedFeatures!: string[];
}


export class FunderRegistryOntologyId
  extends OntologyId
  implements IFunderRegistryOntologyId
{
  @ApiProperty({ type: String, enum: [Ontologies.FunderRegistry] })
  public namespace!: Ontologies.FunderRegistry;

  @ApiProperty({
    type: String,
    example: 'http://dx.doi.org/10.13039/100000001',
  })
  public id!: string;
}

export class LinguistOntologyId
  extends OntologyId
  implements ILinguistOntologyId
{
  @ApiProperty({ type: String, enum: [Ontologies.Linguist] })
  public namespace!: Ontologies.Linguist;

  @ApiProperty({ type: String, example: 'Python' })
  public id!: string;
}

export class KisaoOntologyId extends OntologyId implements IKisaoOntologyId {
  @Equals(Ontologies.KISAO)
  @ApiProperty({ type: String, enum: [Ontologies.KISAO], example: 'KISAO' })
  public namespace!: Ontologies.KISAO;

  @ApiProperty({ type: String, example: 'KISAO_0000306' })
  public id!: string;
}

export class SboOntologyId extends OntologyId implements ISboOntologyId {
  @ApiProperty({ type: String, enum: [Ontologies.SBO] })
  @Equals(Ontologies.SBO)
  public namespace!: Ontologies.SBO;

  @ApiProperty({ type: String, example: 'SBO_0000004' })
  public id!: string;
}

export class SioOntologyId extends OntologyId implements ISioOntologyId {
  @ApiProperty({ type: String, enum: [Ontologies.SIO] })
  @Equals(Ontologies.SIO)
  public namespace!: Ontologies.SIO;

  @ApiProperty({ type: String, example: 'SIO_000004' })
  public id!: string;
}

export class SpdxOntologyId extends OntologyId implements ISpdxOntologyId {
  @ApiProperty({ type: String, enum: [Ontologies.SPDX] })
  @Equals(Ontologies.SPDX)
  public namespace!: Ontologies.SPDX;

  @ApiProperty({ type: String, example: '0BSD' })
  public id!: string;
}
