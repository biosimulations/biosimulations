import {
  IModelTarget,
  IModelSymbol,
  IModelChangePattern,
  IAlgorithm,
  IOutputVariablePattern,
  SoftwareInterfaceType,
  ModelChangeType,
  SimulationType,
  Ontologies,
} from '@biosimulations/datamodel/common';
import {
  Citation,
  EdamOntologyIdVersion,
  EdamOntologySedmlIdVersion,
  EdamOntologyCombineArchiveIdVersion,
  KisaoOntologyId,
  KisaoAlgorithmOntologyId,  
  SboOntologyId,
  SboModelingFrameworkOntologyId,
  SioOntologyId,
  DependentPackage,
} from '../common';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AlgorithmParameter } from './algorithmParameter';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  ArrayUnique,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ModelTarget implements IModelTarget {
  @ApiProperty({ type: String, required: true, example: '/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter' })
  @IsString()
  @IsNotEmpty()
  public value!: string;

  @ApiProperty({ type: String, required: true, example: 'XPath' })
  @IsNotEmpty()
  @IsString()
  public grammar!: string;
}

export class ModelSymbol implements IModelSymbol {
  @ApiProperty({ type: String, required: true, example: 'time' })
  @IsString()
  @IsNotEmpty()
  public value!: string;

  @ApiProperty({ type: String, required: true, example: 'urn:sedml:symbol' })
  @IsString()
  @IsNotEmpty()
  public namespace!: string;
}

export class ModelChangePattern implements IModelChangePattern {
  @ApiProperty({
    type: String,
    required: true,
    example: "Change parameter values",
  })
  @IsString()
  @IsNotEmpty()
  public name!: string;

  @ApiProperty({
    type: [String],
    enum: ModelChangeType,
    required: true,
    example: [ModelChangeType.SedAttributeModelChange],
  })
  @IsEnum(ModelChangeType, { each: true })
  public types!: ModelChangeType[];

  @ApiPropertyOptional({
    type: ModelTarget,
    nullable: true,
    required: false,
    default: null,
    example: {
      value: '/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter',
      grammar: 'XPath',
    },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ModelTarget)
  public target: ModelTarget | null = null;

  @ApiPropertyOptional({
    type: ModelSymbol,
    nullable: true,
    required: false,
    default: null,
    example: null,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ModelSymbol)
  public symbol: ModelSymbol | null = null;
}

export class OutputVariablePattern implements IOutputVariablePattern {
  @ApiProperty({
    type: String,
    required: true,
    example: 'Species concentrations',
  })
  @IsString()
  @IsNotEmpty()
  public name!: string;

  @ApiPropertyOptional({
    type: ModelTarget,
    nullable: true,
    required: false,
    default: null,
    example: {
      value: '/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter',
      grammar: 'XPath',
    },
  })
  @ValidateNested()
  @IsOptional()
  @Type(() => ModelTarget)
  public target: ModelTarget | null = null;

  @ApiPropertyOptional({
    type: ModelSymbol,
    nullable: true,
    required: false,
    default: null,
    example: null,
  })
  @ValidateNested()
  @IsOptional()
  @Type(() => ModelSymbol)
  public symbol: ModelSymbol | null = null;
}

export class Algorithm implements IAlgorithm {
  @ValidateNested()
  @Type(() => KisaoAlgorithmOntologyId)
  @ApiProperty({
    type: KisaoOntologyId,
    example: {
      namespace: Ontologies.KISAO,
      id: 'KISAO_0000019',
    }
  })
  public kisaoId!: KisaoOntologyId;

  @ArrayUnique((parameter: AlgorithmParameter) => parameter?.kisaoId?.id, {
    message:
      'Two or more parameters have the same KiSAO id. Each parameter must have a unique KiSAO id.',
  })
  @ValidateNested({ each: true })
  @Type(() => AlgorithmParameter)
  @IsOptional()
  @ApiPropertyOptional({ 
    type: [AlgorithmParameter], 
    nullable: true,
    required: false, 
    default: null,
  })
  public parameters: AlgorithmParameter[] | null = null;

  @ApiPropertyOptional({
    type: [SioOntologyId],
    nullable: true,
    required: false,
    default: null,
    example: [{
      namespace: Ontologies.SIO,
      id: 'SIO_000004',
    }]
  })
  @ValidateNested({ each: true })
  @Type(() => SioOntologyId)
  @IsOptional()
  public outputDimensions: SioOntologyId[] | null = null;

  @ApiProperty({ type: [OutputVariablePattern], required: true })
  @ValidateNested({ each: true })
  @Type(() => OutputVariablePattern)
  public outputVariablePatterns!: OutputVariablePattern[];

  @ApiPropertyOptional({
    description:
      'Id of the algorithm within the simulator such as the name of the function which implements the algorithm. The scope of this id is typically limited to the individual simulator.',
    type: String,
    nullable: true,
    required: false,
    default: null,
  })
  @IsString()
  @IsOptional()
  public id: string | null = null;

  @ApiPropertyOptional({
    description:
      'Name of the algorithm within the simulator. The scope of this name is typically limited to the individual simulator.',
    type: String,
    nullable: true,
    required: false,
    default: null,
  })
  @IsString()
  @IsOptional()
  public name: string | null = null;

  @ApiProperty({
    type: [SboOntologyId],
    example: {
      namespace: Ontologies.SBO,
      id: 'SBO_0000293',
    },
  })
  @ValidateNested({ each: true })
  @Type(() => SboModelingFrameworkOntologyId)
  public modelingFrameworks!: SboOntologyId[];

  @ApiProperty({
    type: [EdamOntologyIdVersion],
    example: [{
      namespace: Ontologies.EDAM,
      id: 'format_2585',
    }],
  })
  @ValidateNested({ each: true })
  @Type(() => EdamOntologyIdVersion)
  public modelFormats!: EdamOntologyIdVersion[];

  @ApiProperty({type: [ModelChangePattern], required: true })
  @ValidateNested({ each: true })
  @Type(() => ModelChangePattern)
  public modelChangePatterns!: ModelChangePattern[];

  @ApiProperty({
    type: [EdamOntologyIdVersion],
    example: [{
      namespace: Ontologies.EDAM,
      id: 'format_3685',
    }],
  })
  @ValidateNested({ each: true })
  @Type(() => EdamOntologySedmlIdVersion)
  public simulationFormats!: EdamOntologyIdVersion[];

  @ApiProperty({
    type: [String],
    enum: SimulationType,
  })
  @IsEnum(SimulationType, { each: true })
  public simulationTypes!: SimulationType[];

  @ApiProperty({
    type: [EdamOntologyIdVersion],
    example: [{
      namespace: Ontologies.EDAM,
      id: 'format_3686',
    }],
  })
  @ValidateNested({ each: true })
  @Type(() => EdamOntologyCombineArchiveIdVersion)
  public archiveFormats!: EdamOntologyIdVersion[];

  @ApiProperty({
    type: [String],
    enum: SoftwareInterfaceType,
    description: 'List of software interfaces which support the parameter',
  })
  @IsEnum(SoftwareInterfaceType, { each: true })
  public availableSoftwareInterfaceTypes!: SoftwareInterfaceType[];

  @ApiPropertyOptional({ type: [DependentPackage], nullable: true, required: false, default: null })
  @ValidateNested({ each: true })
  @Type(() => DependentPackage)
  @IsOptional()
  public dependencies: DependentPackage[] | null = null;

  @ApiProperty({ type: [Citation] })
  @ValidateNested({ each: true })
  @Type(() => Citation)
  public citations!: Citation[];
}
