import {
  IModelTarget,
  IModelSymbol,
  IModelChangePattern,
  IAlgorithm,
  IOutputVariablePattern,
  SoftwareInterfaceType,
  ModelChangeType,
  SimulationType,
} from '@biosimulations/datamodel/common';
import {
  Citation,
  EdamOntologyIdVersion,
  KisaoOntologyId,
  SboOntologyId,
  SioOntologyId,
  DependentPackage,
} from '../common';

import { ApiProperty } from '@nestjs/swagger';
import { AlgorithmParameter } from './algorithmParameter';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ModelTarget implements IModelTarget {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  public value!: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  public grammar!: string;
}

export class ModelSymbol implements IModelSymbol {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  public value!: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  public namespace!: string;
}

export class ModelChangePattern implements IModelChangePattern {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  public name!: string;

  @ApiProperty({
    type: [String],
    enum: ModelChangeType,
    required: true,
  })
  @IsEnum(ModelChangeType, { each: true })
  public types!: ModelChangeType[];

  @ApiProperty({
    type: ModelTarget,
    nullable: true,
    required: false,
    default: null,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ModelTarget)
  public target!: ModelTarget | null;

  @ApiProperty({
    type: ModelSymbol,
    nullable: true,
    required: false,
    default: null,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ModelSymbol)
  public symbol!: ModelSymbol | null;
}

export class OutputVariablePattern implements IOutputVariablePattern {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  public name!: string;

  @ApiProperty({
    type: ModelTarget,
    nullable: true,
    required: false,
    default: null,
  })
  @ValidateNested()
  @IsOptional()
  @Type(() => ModelSymbol)
  public target!: ModelTarget | null;

  @ApiProperty({
    type: ModelSymbol,
    nullable: true,
    required: false,
    default: null,
  })
  @ValidateNested()
  @IsOptional()
  @Type(() => ModelSymbol)
  public symbol!: ModelSymbol | null;
}

export class Algorithm implements IAlgorithm {
  @ValidateNested()
  @Type(() => KisaoOntologyId)
  @ApiProperty({ type: KisaoOntologyId })
  public kisaoId!: KisaoOntologyId;

  @ValidateNested({ each: true })
  @Type(() => AlgorithmParameter)
  @IsOptional()
  @ApiProperty({ type: [AlgorithmParameter], nullable: true })
  public parameters!: AlgorithmParameter[] | null;

  @ApiProperty({ type: [SioOntologyId], nullable: true })
  @ValidateNested({ each: true })
  @Type(() => SioOntologyId)
  @IsOptional()
  public outputDimensions!: SioOntologyId[] | null;

  @ApiProperty({ type: [OutputVariablePattern], required: true })
  @ValidateNested({ each: true })
  @Type(() => OutputVariablePattern)
  public outputVariablePatterns!: OutputVariablePattern[];

  @ApiProperty({
    description:
      'Id of the algorithm within the simulator such as the name of the function which implements the algorithm. The scope of this id is typically limited to the individual simulator.',
    type: String,
    nullable: true,
    required: false,
    default: null,
  })
  @IsString()
  @IsOptional()
  public id!: string | null;

  @ApiProperty({
    description:
      'Name of the algorithm within the simulator. The scope of this name is typically limited to the individual simulator.',
    type: String,
    nullable: true,
    required: false,
    default: null,
  })
  @IsString()
  @IsOptional()
  public name!: string | null;

  @ApiProperty({ type: [SboOntologyId] })
  @ValidateNested({ each: true })
  @Type(() => SboOntologyId)
  public modelingFrameworks!: SboOntologyId[];

  @ApiProperty({ type: [EdamOntologyIdVersion] })
  @ValidateNested({ each: true })
  @Type(() => EdamOntologyIdVersion)
  public modelFormats!: EdamOntologyIdVersion[];

  @ApiProperty({ type: [ModelChangePattern], required: true })
  @ValidateNested({ each: true })
  @Type(() => ModelChangePattern)
  public modelChangePatterns!: ModelChangePattern[];

  @ApiProperty({ type: [EdamOntologyIdVersion] })
  @ValidateNested({ each: true })
  @Type(() => EdamOntologyIdVersion)
  public simulationFormats!: EdamOntologyIdVersion[];

  @ApiProperty({
    type: [String],
    enum: SimulationType,
  })
  @IsEnum(SimulationType, { each: true })
  public simulationTypes!: SimulationType[];

  @ApiProperty({ type: [EdamOntologyIdVersion] })
  @ValidateNested({ each: true })
  @Type(() => EdamOntologyIdVersion)
  public archiveFormats!: EdamOntologyIdVersion[];

  @ApiProperty({
    type: [String],
    enum: SoftwareInterfaceType,
    description: 'List of software interfaces which support the parameter',
  })
  @IsEnum(SoftwareInterfaceType, { each: true })
  public availableSoftwareInterfaceTypes!: SoftwareInterfaceType[];

  @ApiProperty({ type: [DependentPackage], nullable: true })
  @ValidateNested({ each: true })
  @Type(() => DependentPackage)
  @IsOptional()
  public dependencies!: DependentPackage[] | null;

  @ApiProperty({ type: [Citation] })
  @ValidateNested({ each: true })
  @Type(() => Citation)
  public citations!: Citation[];
}
