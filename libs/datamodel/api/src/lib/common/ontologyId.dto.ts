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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Equals,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsOptional,
  Matches,
} from 'class-validator';
import { IsOntologyTerm } from '@biosimulations/ontology/utils';

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
  @ApiProperty({ type: String, enum: [Ontologies.EDAM], example: Ontologies.EDAM })
  @Equals(Ontologies.EDAM)
  public namespace!: Ontologies.EDAM;

  @ApiProperty({ type: String, example: 'format_3973' })
  @IsOntologyTerm(Ontologies.EDAM)
  public id!: string;
}

export class EdamOntologyIdVersion
  extends OntologyId
  implements IEdamOntologyIdVersion
{
  @Equals(Ontologies.EDAM)
  @IsString()
  @ApiProperty({ type: String, enum: [Ontologies.EDAM], example: Ontologies.EDAM })
  public namespace!: Ontologies.EDAM;

  @IsOntologyTerm(Ontologies.EDAM)
  @Matches(/^format_\d{4,4}$/, {message: 'Value must be the id of an EDAM format term'})
  @IsString()
  @ApiProperty({ type: String, example: 'format_3973' })
  public id!: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, example: 'L3V2', nullable: true, default: null })
  public version: string | null = null;

  @IsOptional()
  @IsString({ each: true })
  @ApiPropertyOptional({
    type: [String],
    description: 'Supported features of the format',
    example: ['event'],
    default: [],
  })
  public supportedFeatures: string[] = [];
}

export class EdamOntologySedmlIdVersion extends EdamOntologyIdVersion {
  @Equals(Ontologies.EDAM)
  @IsString()
  @ApiProperty({ type: String, enum: [Ontologies.EDAM], example: Ontologies.EDAM })
  public namespace!: Ontologies.EDAM;

  @Equals('format_3685')
  @IsString()
  @ApiProperty({ type: String, example: 'format_3685' })
  public id!: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, example: 'L1V3', nullable: true, default: null })
  public version: string | null = null;

  @IsOptional()
  @IsString({ each: true })
  @ApiPropertyOptional({
    type: [String],
    description: 'Supported features of the format',
    default: [],
    example: ['RepeatedTask'],
  })
  public supportedFeatures: string[] = [];
}

export class EdamOntologyCombineArchiveIdVersion extends EdamOntologyIdVersion {
  @Equals(Ontologies.EDAM)
  @IsString()
  @ApiProperty({ type: String, enum: [Ontologies.EDAM], example: Ontologies.EDAM })
  public namespace!: Ontologies.EDAM;

  @Equals('format_3686')
  @IsString()
  @ApiProperty({ type: String, example: 'format_3686' })
  public id!: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, example: null, nullable: true, default: null })
  public version: string | null = null;

  @IsOptional()
  @IsString({ each: true })
  @ApiPropertyOptional({
    type: [String],
    description: 'Supported features of the format',
    default: [],
    example: [],
  })
  public supportedFeatures: string[] = [];
}

export class EdamOntologyDockerImageIdVersion extends EdamOntologyIdVersion {
  @Equals(Ontologies.EDAM)
  @IsString()
  @ApiProperty({ type: String, enum: [Ontologies.EDAM], example: Ontologies.EDAM })
  public namespace!: Ontologies.EDAM;

  @Equals('format_3973')
  @IsString()
  @ApiProperty({ type: String, example: 'format_3973' })
  public id!: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, example: null, nullable: true, default: null })
  public version: string | null = null;

  @IsOptional()
  @IsString({ each: true })
  @ApiPropertyOptional({
    type: [String],
    description: 'Supported features of the format',
    default: [],
    example: [],
  })
  public supportedFeatures: string[] = [];
}

export class FunderRegistryOntologyId
  extends OntologyId
  implements IFunderRegistryOntologyId
{
  @ApiProperty({
    type: String,
    enum: [Ontologies.FunderRegistry],
    example: Ontologies.FunderRegistry,
  })
  @Equals(Ontologies.FunderRegistry)
  public namespace!: Ontologies.FunderRegistry;

  @ApiProperty({
    type: String,
    example: '100000001',
  })
  @IsOntologyTerm(Ontologies.FunderRegistry)
  public id!: string;
}

export class LinguistOntologyId
  extends OntologyId
  implements ILinguistOntologyId
{
  @ApiProperty({ type: String, enum: [Ontologies.Linguist], example: Ontologies.Linguist })
  @Equals(Ontologies.Linguist)
  public namespace!: Ontologies.Linguist;

  @ApiProperty({ type: String, example: 'Python' })
  @IsOntologyTerm(Ontologies.Linguist)
  public id!: string;
}

export class KisaoOntologyId extends OntologyId implements IKisaoOntologyId {
  @Equals(Ontologies.KISAO)
  @ApiProperty({ type: String, enum: [Ontologies.KISAO], example: Ontologies.KISAO })
  public namespace!: Ontologies.KISAO;

  @ApiProperty({ type: String, example: 'KISAO_0000306' })
  @IsOntologyTerm(Ontologies.KISAO)
  public id!: string;
}

export class KisaoAlgorithmOntologyId extends KisaoOntologyId {
  @Equals(Ontologies.KISAO)
  @ApiProperty({ type: String, enum: [Ontologies.KISAO], example: Ontologies.KISAO })
  public namespace!: Ontologies.KISAO;

  @ApiProperty({ type: String, example: 'KISAO_0000019' })
  @IsOntologyTerm(Ontologies.KISAO, 'KISAO_0000000')
  public id!: string;
}

export class KisaoAlgorithmParameterOntologyId extends KisaoOntologyId {
  @Equals(Ontologies.KISAO)
  @ApiProperty({ type: String, enum: [Ontologies.KISAO], example: Ontologies.KISAO })
  public namespace!: Ontologies.KISAO;

  @ApiProperty({ type: String, example: 'KISAO_0000488' })
  @IsOntologyTerm(Ontologies.KISAO, 'KISAO_0000201')
  public id!: string;
}

export class SboOntologyId extends OntologyId implements ISboOntologyId {
  @ApiProperty({ type: String, enum: [Ontologies.SBO], example: Ontologies.SBO })
  @Equals(Ontologies.SBO)
  public namespace!: Ontologies.SBO;

  @ApiProperty({ type: String, example: 'SBO_0000293' })
  @IsOntologyTerm(Ontologies.SBO)
  public id!: string;
}

export class SboModelingFrameworkOntologyId extends SboOntologyId {
  @ApiProperty({ type: String, enum: [Ontologies.SBO], example: Ontologies.SBO })
  @Equals(Ontologies.SBO)
  public namespace!: Ontologies.SBO;

  @ApiProperty({ type: String, example: 'SBO_0000293' })
  @IsOntologyTerm(Ontologies.SBO, 'SBO_0000004')
  public id!: string;
}

export class SioOntologyId extends OntologyId implements ISioOntologyId {
  @ApiProperty({ type: String, enum: [Ontologies.SIO], example: Ontologies.SIO })
  @Equals(Ontologies.SIO)
  public namespace!: Ontologies.SIO;

  @ApiProperty({ type: String, example: 'SIO_000004' })
  @IsOntologyTerm(Ontologies.SIO)
  public id!: string;
}

export class SpdxOntologyId extends OntologyId implements ISpdxOntologyId {
  @ApiProperty({ type: String, enum: [Ontologies.SPDX], example: Ontologies.SPDX })
  @Equals(Ontologies.SPDX)
  public namespace!: Ontologies.SPDX;

  @ApiProperty({ type: String, example: '0BSD' })
  @IsOntologyTerm(Ontologies.SPDX)
  public id!: string;
}
