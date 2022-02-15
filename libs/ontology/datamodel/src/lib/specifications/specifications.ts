import {
  ApiProperty,
  ApiResponseProperty,
  getSchemaPath,
  ApiExtraModels,
} from '@nestjs/swagger';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import {
  SimulationRunSedDocument as ISimulationRunSedDocument,
  SimulationRunSedDocumentInput as ISimulationRunSedDocumentInput,
  SimulationRunSedDocumentInputsContainer as ISimulationRunSedDocumentInputsContainer,
  SerializedSedStyle as ISedStyle,
  SedLineStyle as ISedLineStyle,
  SedMarkerStyle as ISedMarkerStyle,
  SedFillStyle as ISedFillStyle,
  SedColor,
  SedLineStyleType,
  SedMarkerStyleType,
  SerializedSedModel as ISedModel,
  SedModelAttributeChange as ISedModelAttributeChange,
  SedAddElementModelChange as ISedAddElementModelChange,
  SedReplaceElementModelChange as ISedReplaceElementModelChange,
  SedRemoveElementModelChange as ISedRemoveElementModelChange,
  SerializedSedComputeModelChange as ISedComputeModelChange,
  SerializedSedSetValueComputeModelChange as ISedSetValueComputeModelChange,
  SedOneStepSimulation as ISedOneStepSimulation,
  SedSteadyStateSimulation as ISedSteadyStateSimulation,
  SedUniformTimeCourseSimulation as ISedUniformTimeCourseSimulation,
  SedAlgorithm as ISedAlgorithm,
  SedAlgorithmParameterChange as ISedAlgorithmParameterChange,
  SerializedSedTask as ISedTask,
  SerializedSedRepeatedTask as ISedRepeatedTask,
  SerializedSedSubTask as ISedSubTask,
  SerializedSedFunctionalRange as ISedFunctionalRange,
  SedUniformRange as ISedUniformRange,
  SedUniformRangeType,
  SedVectorRange as ISedVectorRange,
  SerializedSedDataGenerator as ISedDataGenerator,
  SerializedSedReport as ISedReport,
  SerializedSedPlot2D as ISedPlot2D,
  SerializedSedPlot3D as ISedPlot3D,
  SerializedSedDataSet as ISedDataSet,
  SerializedSedCurve as ISedCurve,
  SerializedSedSurface as ISedSurface,
  SerializedSedVariable as ISedVariable,
  SedParameter as ISedParameter,
  SedTarget as ISedTarget,
  Namespace as INamespace,
  SedAxisScale,
  Ontologies,
} from '@biosimulations/datamodel/common';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsUrl,
  ValidateNested,
  IsEnum,
  Equals,
  Min,
  IsInt,
  IsPositive,
  IsArray,
  IsBoolean,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsHexidecimalColor } from '@biosimulations/datamodel/utils';
import { IsOntologyTerm } from '@biosimulations/ontology/utils';

export class SedLineStyle implements ISedLineStyle {
  @ApiProperty({ type: String, enum: ['SedLineStyle'] })
  @Equals('SedLineStyle')
  public _type!: 'SedLineStyle';

  @ApiProperty({
    type: String,
    enum: SedLineStyleType,
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsEnum(SedLineStyleType)
  public type?: SedLineStyleType;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsOptional()
  @IsHexidecimalColor()
  public color?: SedColor;

  @ApiProperty({ type: Number, required: false, nullable: true })
  @IsOptional()
  @Min(0)
  @IsNumber()
  public thickness?: number;
}

export class SedMarkerStyle implements ISedMarkerStyle {
  @ApiProperty({ type: String, enum: ['SedMarkerStyle'] })
  @Equals('SedMarkerStyle')
  public _type!: 'SedMarkerStyle';

  @ApiProperty({
    type: String,
    enum: SedMarkerStyleType,
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsEnum(SedMarkerStyleType)
  public type?: SedMarkerStyleType;

  @ApiProperty({ type: Number, required: false, nullable: true })
  @IsOptional()
  @Min(0)
  @IsNumber()
  public size?: number;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsOptional()
  @IsHexidecimalColor()
  public lineColor?: SedColor;

  @ApiProperty({ type: Number, required: false, nullable: true })
  @IsOptional()
  @Min(0)
  @IsNumber()
  public lineThickness?: number;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsOptional()
  @IsHexidecimalColor()
  public fillColor?: SedColor;
}

export class SedFillStyle implements ISedFillStyle {
  @ApiProperty({ type: String, enum: ['SedFillStyle'] })
  @Equals('SedFillStyle')
  public _type!: 'SedFillStyle';

  @ApiProperty({ type: String, required: true, nullable: false })
  @IsHexidecimalColor()
  public color!: SedColor;
}

export class SedStyle implements ISedStyle {
  @ApiProperty({ type: String, enum: ['SedStyle'] })
  @Equals('SedStyle')
  public _type!: 'SedStyle';

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public id!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsOptional()
  @IsString()
  public name?: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsOptional()
  @IsString()
  public base?: string;

  @ApiProperty({ type: SedLineStyle, required: false, nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => SedLineStyle)
  public line?: SedLineStyle;

  @ApiProperty({ type: SedMarkerStyle, required: false, nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => SedMarkerStyle)
  public marker?: SedMarkerStyle;

  @ApiProperty({ type: SedFillStyle, required: false, nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => SedFillStyle)
  public fill?: SedFillStyle;
}

export class Namespace implements INamespace {
  @ApiProperty({ type: String, enum: ['Namespace'] })
  @Equals('Namespace')
  public _type!: 'Namespace';

  @ApiProperty({
    type: String,
    example: 'sbml',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public prefix?: string;

  @ApiProperty({
    type: String,
    example: 'http://www.sbml.org/sbml/level2/version4',
  })
  @IsUrl({
    require_protocol: true,
    protocols: ['http', 'https'],
  })
  public uri!: string;
}

export class SedTarget implements ISedTarget {
  @ApiProperty({ type: String, enum: ['SedTarget'] })
  @Equals('SedTarget')
  public _type!: 'SedTarget';

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public value!: string;

  @ApiProperty({ type: [Namespace], required: false, nullable: true })
  @IsOptional()
  @Type(() => Namespace)
  @ValidateNested({ each: true })
  public namespaces?: Namespace[];
}

export class SedParameter implements ISedParameter {
  @ApiProperty({ type: String, enum: ['SedParameter'] })
  @Equals('SedParameter')
  public _type!: 'SedParameter';

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public id!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsOptional()
  @IsString()
  public name?: string;

  @ApiProperty({ type: Number, required: false, nullable: true })
  @IsNumber()
  public value!: number;
}

export class SedVariable implements ISedVariable {
  @ApiProperty({ type: String, enum: ['SedVariable'] })
  @Equals('SedVariable')
  public _type!: 'SedVariable';

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public id!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsOptional()
  @IsString()
  public name?: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public symbol?: string;

  @ApiProperty({ type: SedTarget, required: false, nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => SedTarget)
  public target?: SedTarget;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public task!: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public model?: string;
}

export class SedModelAttributeChange implements ISedModelAttributeChange {
  @ApiProperty({ type: String, enum: ['SedModelAttributeChange'] })
  @Equals('SedModelAttributeChange')
  public _type!: 'SedModelAttributeChange';

  @ApiProperty({ type: String })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public id?: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsOptional()
  @IsString()
  public name?: string;

  @ApiProperty({ type: SedTarget })
  @IsOptional()
  @ValidateNested()
  @Type(() => SedTarget)
  public target!: SedTarget;

  @ApiProperty({ type: String })
  @IsString()
  public newValue!: string;
}

export class SedAddElementModelChange implements ISedAddElementModelChange {
  @ApiProperty({ type: String, enum: ['SedAddElementModelChange'] })
  @Equals('SedAddElementModelChange')
  public _type!: 'SedAddElementModelChange';

  @ApiProperty({ type: String })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public id?: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsOptional()
  @IsString()
  public name?: string;

  @ApiProperty({ type: SedTarget })
  @ValidateNested()
  @Type(() => SedTarget)
  public target!: SedTarget;

  @ApiProperty({ type: [String] })
  @IsString({ each: true })
  @IsArray()
  public newElements!: string[];
}

export class SedReplaceElementModelChange
  implements ISedReplaceElementModelChange
{
  @ApiProperty({ type: String, enum: ['SedReplaceElementModelChange'] })
  @Equals('SedReplaceElementModelChange')
  public _type!: 'SedReplaceElementModelChange';

  @ApiProperty({ type: String })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public id?: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsOptional()
  @IsString()
  public name?: string;

  @ApiProperty({ type: SedTarget })
  @ValidateNested()
  @Type(() => SedTarget)
  public target!: SedTarget;

  @ApiProperty({ type: [String] })
  @IsString({ each: true })
  @IsArray()
  public newElements!: string[];
}

export class SedRemoveElementModelChange
  implements ISedRemoveElementModelChange
{
  @ApiProperty({ type: String, enum: ['SedRemoveElementModelChange'] })
  @Equals('SedRemoveElementModelChange')
  public _type!: 'SedRemoveElementModelChange';

  @ApiProperty({ type: String })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public id?: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsOptional()
  @IsString()
  public name?: string;

  @ApiProperty({ type: SedTarget })
  @ValidateNested()
  @Type(() => SedTarget)
  public target!: SedTarget;
}

export class SedComputeModelChange implements ISedComputeModelChange {
  @ApiProperty({ type: String, enum: ['SedComputeModelChange'] })
  @Equals('SedComputeModelChange')
  public _type!: 'SedComputeModelChange';

  @ApiProperty({ type: String })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public id?: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsOptional()
  @IsString()
  public name?: string;

  @ApiProperty({ type: SedTarget })
  @ValidateNested()
  @Type(() => SedTarget)
  public target!: SedTarget;

  @ApiProperty({ type: [SedParameter] })
  @Type(() => SedParameter)
  @ValidateNested({ each: true })
  public parameters!: SedParameter[];

  @ApiProperty({ type: [SedVariable] })
  @Type(() => SedVariable)
  @ValidateNested({ each: true })
  public variables!: SedVariable[];

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public math!: string;
}

export type SedModelChange =
  | SedModelAttributeChange
  | SedAddElementModelChange
  | SedReplaceElementModelChange
  | SedRemoveElementModelChange
  | SedComputeModelChange;

@ApiExtraModels(SedModelAttributeChange)
@ApiExtraModels(SedAddElementModelChange)
@ApiExtraModels(SedReplaceElementModelChange)
@ApiExtraModels(SedRemoveElementModelChange)
@ApiExtraModels(SedComputeModelChange)
export class SedModel implements ISedModel {
  @ApiProperty({ type: String, enum: ['SedModel'] })
  @Equals('SedModel')
  public _type!: 'SedModel';

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public id!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsOptional()
  @IsString()
  public name?: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public language!: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public source!: string;

  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(SedModelAttributeChange) },
      { $ref: getSchemaPath(SedAddElementModelChange) },
      { $ref: getSchemaPath(SedReplaceElementModelChange) },
      { $ref: getSchemaPath(SedRemoveElementModelChange) },
      { $ref: getSchemaPath(SedComputeModelChange) },
    ],
  })
  @Type(() => Object, {
    discriminator: {
      property: '_type',
      subTypes: [
        { value: SedModelAttributeChange, name: 'SedModelAttributeChange' },
        { value: SedAddElementModelChange, name: 'SedAddElementModelChange' },
        {
          value: SedReplaceElementModelChange,
          name: 'SedReplaceElementModelChange',
        },
        {
          value: SedRemoveElementModelChange,
          name: 'SedRemoveElementModelChange',
        },
        { value: SedComputeModelChange, name: 'SedComputeModelChange' },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  @ValidateNested({ each: true })
  public changes!: SedModelChange[];
}

export class SedAlgorithmParameterChange
  implements ISedAlgorithmParameterChange
{
  @ApiProperty({ type: String, enum: ['SedAlgorithmParameterChange'] })
  @Equals('SedAlgorithmParameterChange')
  public _type!: 'SedAlgorithmParameterChange';

  @ApiProperty({
    type: String,
    example: 'KISAO_0000488',
    pattern: '^KISAO_\\d{7,7}$',
  })
  @IsOntologyTerm(Ontologies.KISAO, 'KISAO_0000201')
  public kisaoId!: string;

  @ApiProperty({ type: String })
  @IsString()
  public newValue!: string;
}

export class SedAlgorithm implements ISedAlgorithm {
  @ApiProperty({ type: String, enum: ['SedAlgorithm'] })
  @Equals('SedAlgorithm')
  public _type!: 'SedAlgorithm';

  @ApiProperty({
    type: String,
    example: 'KISAO_0000019',
    pattern: '^KISAO_\\d{7,7}$',
  })
  @IsOntologyTerm(Ontologies.KISAO, 'KISAO_0000000')
  public kisaoId!: string;

  @ApiProperty({ type: [SedAlgorithmParameterChange] })
  @Type(() => SedAlgorithmParameterChange)
  @ValidateNested({ each: true })
  public changes!: SedAlgorithmParameterChange[];
}

export class SedUniformTimeCourseSimulation
  implements ISedUniformTimeCourseSimulation
{
  @ApiProperty({ type: String, enum: ['SedUniformTimeCourseSimulation'] })
  @Equals('SedUniformTimeCourseSimulation')
  public _type!: 'SedUniformTimeCourseSimulation';

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public id!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsOptional()
  @IsString()
  public name?: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  public initialTime!: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  public outputStartTime!: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  public outputEndTime!: number;

  @ApiProperty({ type: Number })
  @Min(0)
  @IsInt()
  public numberOfSteps!: number;

  @ApiProperty({ type: SedAlgorithm })
  @ValidateNested()
  @Type(() => SedAlgorithm)
  public algorithm!: SedAlgorithm;
}

export class SedSteadyStateSimulation implements ISedSteadyStateSimulation {
  @ApiProperty({ type: String, enum: ['SedSteadyStateSimulation'] })
  @Equals('SedSteadyStateSimulation')
  public _type!: 'SedSteadyStateSimulation';

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public id!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsOptional()
  @IsString()
  public name?: string;

  @ApiProperty({ type: SedAlgorithm })
  @ValidateNested()
  @Type(() => SedAlgorithm)
  public algorithm!: SedAlgorithm;
}

export class SedOneStepSimulation implements ISedOneStepSimulation {
  @ApiProperty({ type: String, enum: ['SedOneStepSimulation'] })
  @Equals('SedOneStepSimulation')
  public _type!: 'SedOneStepSimulation';

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public id!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsOptional()
  @IsString()
  public name?: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  public step!: number;

  @ApiProperty({ type: SedAlgorithm })
  @ValidateNested()
  @Type(() => SedAlgorithm)
  public algorithm!: SedAlgorithm;
}

export type SedSimulation =
  | SedUniformTimeCourseSimulation
  | SedSteadyStateSimulation
  | SedOneStepSimulation;

export const SedSimulationSchema: SchemaObject = {
  oneOf: [
    { $ref: getSchemaPath(SedUniformTimeCourseSimulation) },
    { $ref: getSchemaPath(SedSteadyStateSimulation) },
    { $ref: getSchemaPath(SedOneStepSimulation) },
  ],
};

export class SedTask implements ISedTask {
  @ApiProperty({ type: String, enum: ['SedTask'] })
  @Equals('SedTask')
  public _type!: 'SedTask';

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public id!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsOptional()
  @IsString()
  public name?: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public model!: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public simulation!: string;
}

export class SedFunctionalRange implements ISedFunctionalRange {
  @ApiProperty({ type: String, enum: ['SedFunctionalRange'] })
  @Equals('SedFunctionalRange')
  public _type!: 'SedFunctionalRange';

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public id!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsOptional()
  @IsString()
  public name?: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public range!: string;

  @ApiProperty({ type: [SedParameter] })
  @Type(() => SedParameter)
  @ValidateNested({ each: true })
  public parameters!: SedParameter[];

  @ApiProperty({ type: [SedVariable] })
  @Type(() => SedVariable)
  @ValidateNested({ each: true })
  public variables!: SedVariable[];

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public math!: string;
}

export class SedUniformRange implements ISedUniformRange {
  @ApiProperty({ type: String, enum: ['SedUniformRange'] })
  @Equals('SedUniformRange')
  public _type!: 'SedUniformRange';

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public id!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsOptional()
  @IsString()
  public name?: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  public start!: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  public end!: number;

  @ApiProperty({ type: Number })
  @IsPositive()
  @IsInt()
  public numberOfSteps!: number;

  @ApiProperty({ type: String, enum: SedUniformRangeType })
  @IsEnum(SedUniformRangeType)
  public type!: SedUniformRangeType;
}

export class SedVectorRange implements ISedVectorRange {
  @ApiProperty({ type: String, enum: ['SedVectorRange'] })
  @Equals('SedVectorRange')
  public _type!: 'SedVectorRange';

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public id!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsOptional()
  @IsString()
  public name?: string;

  @ApiProperty({ type: [Number] })
  @IsNumber({}, { each: true })
  @IsArray()
  public values!: number[];
}

export type SedRange = SedFunctionalRange | SedUniformRange | SedVectorRange;

export const SedRangeSchema: SchemaObject = {
  oneOf: [
    { $ref: getSchemaPath(SedFunctionalRange) },
    { $ref: getSchemaPath(SedUniformRange) },
    { $ref: getSchemaPath(SedVectorRange) },
  ],
};

export class SedSetValueComputeModelChange
  implements ISedSetValueComputeModelChange
{
  @ApiProperty({ type: String, enum: ['SedSetValueComputeModelChange'] })
  @Equals('SedSetValueComputeModelChange')
  public _type!: 'SedSetValueComputeModelChange';

  @ApiProperty({ type: String })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public id?: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsOptional()
  @IsString()
  public name?: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public model!: string;

  @ApiProperty({ type: SedTarget, required: false, nullable: true })
  @ValidateNested()
  @Type(() => SedTarget)
  public target!: SedTarget;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public symbol?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public range?: string;

  @ApiProperty({ type: [SedParameter] })
  @Type(() => SedParameter)
  @ValidateNested({ each: true })
  public parameters!: SedParameter[];

  @ApiProperty({ type: [SedVariable] })
  @Type(() => SedVariable)
  @ValidateNested({ each: true })
  public variables!: SedVariable[];

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public math!: string;
}

export class SedSubTask implements ISedSubTask {
  @ApiProperty({ type: String, enum: ['SedSubTask'] })
  @Equals('SedSubTask')
  public _type!: 'SedSubTask';

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public task!: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  public order!: number;
}

@ApiExtraModels(SedFunctionalRange)
@ApiExtraModels(SedUniformRange)
@ApiExtraModels(SedVectorRange)
export class SedRepeatedTask implements ISedRepeatedTask {
  @ApiProperty({ type: String, enum: ['SedRepeatedTask'] })
  @Equals('SedRepeatedTask')
  public _type!: 'SedRepeatedTask';

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public id!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsOptional()
  @IsString()
  public name?: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public range!: string;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  public resetModelForEachIteration!: boolean;

  @ApiProperty({ type: [SedSetValueComputeModelChange] })
  @Type(() => SedSetValueComputeModelChange)
  @ValidateNested({ each: true })
  public changes!: SedSetValueComputeModelChange[];

  @ApiProperty({ type: [SedSubTask] })
  @Type(() => SedSubTask)
  @ValidateNested({ each: true })
  public subTasks!: SedSubTask[];

  @ApiProperty({
    type: 'array',
    items: {
      oneOf: [
        { $ref: getSchemaPath(SedFunctionalRange) },
        { $ref: getSchemaPath(SedUniformRange) },
        { $ref: getSchemaPath(SedVectorRange) },
      ],
    },
  })
  @Type(() => Object, {
    discriminator: {
      property: '_type',
      subTypes: [
        { value: SedFunctionalRange, name: 'SedFunctionalRange' },
        { value: SedUniformRange, name: 'SedUniformRange' },
        { value: SedVectorRange, name: 'SedVectorRange' },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  @ValidateNested({ each: true })
  public ranges!: SedRange[];
}

export type SedAbstractTask = SedTask | SedRepeatedTask;

export const SedAbstractTaskSchema: SchemaObject = {
  oneOf: [
    { $ref: getSchemaPath(SedTask) },
    { $ref: getSchemaPath(SedRepeatedTask) },
  ],
};

export class SedDataGenerator implements ISedDataGenerator {
  @ApiProperty({ type: String, enum: ['SedDataGenerator'] })
  @Equals('SedDataGenerator')
  public _type!: 'SedDataGenerator';

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public id!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsOptional()
  @IsString()
  public name?: string;

  @ApiProperty({ type: [SedParameter] })
  @Type(() => SedParameter)
  @ValidateNested({ each: true })
  public parameters!: SedParameter[];

  @ApiProperty({ type: [SedVariable] })
  @Type(() => SedVariable)
  @ValidateNested({ each: true })
  public variables!: SedVariable[];

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public math!: string;
}

export class SedDataSet implements ISedDataSet {
  @ApiProperty({ type: String, enum: ['SedDataSet'] })
  @Equals('SedDataSet')
  public _type!: 'SedDataSet';

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public id!: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public dataGenerator!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsOptional()
  @IsString()
  public name?: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public label!: string;
}

export class SedReport implements ISedReport {
  @ApiProperty({ type: String, enum: ['SedReport'] })
  @Equals('SedReport')
  public _type!: 'SedReport';

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public id!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsOptional()
  @IsString()
  public name?: string;

  @ApiProperty({ type: [SedDataSet] })
  @Type(() => SedDataSet)
  @ValidateNested({ each: true })
  public dataSets!: SedDataSet[];
}

export class SedCurve implements ISedCurve {
  @ApiProperty({ type: String, enum: ['SedCurve'] })
  @Equals('SedCurve')
  public _type!: 'SedCurve';

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public id!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsOptional()
  @IsString()
  public name?: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public xDataGenerator!: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public yDataGenerator!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public style?: string;
}

export class SedPlot2D implements ISedPlot2D {
  @ApiProperty({ type: String, enum: ['SedPlot2D'] })
  @Equals('SedPlot2D')
  public _type!: 'SedPlot2D';

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public id!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsOptional()
  @IsString()
  public name?: string;

  @ApiProperty({ type: [SedCurve] })
  @Type(() => SedCurve)
  @ValidateNested({ each: true })
  public curves!: SedCurve[];

  @ApiProperty({ type: String, enum: SedAxisScale })
  @IsEnum(SedAxisScale)
  public xScale!: SedAxisScale;

  @ApiProperty({ type: String, enum: SedAxisScale })
  @IsEnum(SedAxisScale)
  public yScale!: SedAxisScale;
}

export class SedSurface implements ISedSurface {
  @ApiProperty({ type: String, enum: ['SedSurface'] })
  @Equals('SedSurface')
  public _type!: 'SedSurface';

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public id!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsOptional()
  @IsString()
  public name?: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public xDataGenerator!: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public yDataGenerator!: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public zDataGenerator!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public style?: string;
}

export class SedPlot3D implements ISedPlot3D {
  @ApiProperty({ type: String, enum: ['SedPlot3D'] })
  @Equals('SedPlot3D')
  public _type!: 'SedPlot3D';

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public id!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsOptional()
  @IsString()
  public name?: string;

  @ApiProperty({ type: [SedSurface] })
  @Type(() => SedSurface)
  @ValidateNested({ each: true })
  public surfaces!: SedSurface[];

  @ApiProperty({ type: String, enum: SedAxisScale })
  @IsEnum(SedAxisScale)
  public xScale!: SedAxisScale;

  @ApiProperty({ type: String, enum: SedAxisScale })
  @IsEnum(SedAxisScale)
  public yScale!: SedAxisScale;

  @ApiProperty({ type: String, enum: SedAxisScale })
  @IsEnum(SedAxisScale)
  public zScale!: SedAxisScale;
}

export type SedOutput = SedReport | SedPlot2D | SedPlot3D;

export const SedOutputSchema: SchemaObject = {
  oneOf: [
    { $ref: getSchemaPath(SedReport) },
    { $ref: getSchemaPath(SedPlot2D) },
    { $ref: getSchemaPath(SedPlot3D) },
  ],
};

@ApiExtraModels(SedUniformTimeCourseSimulation)
@ApiExtraModels(SedSteadyStateSimulation)
@ApiExtraModels(SedOneStepSimulation)
@ApiExtraModels(SedReport)
@ApiExtraModels(SedPlot2D)
@ApiExtraModels(SedPlot3D)
@ApiExtraModels(SedTask)
@ApiExtraModels(SedRepeatedTask)
export class SimulationRunSedDocumentInput
  implements ISimulationRunSedDocumentInput
{
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public id!: string;

  @ApiProperty({ type: Number })
  @IsPositive()
  @IsInt()
  public level!: number;

  @ApiProperty({ type: Number })
  @IsPositive()
  @IsInt()
  public version!: number;

  @ApiProperty({ type: [SedStyle] })
  @Type(() => SedStyle)
  @ValidateNested({ each: true })
  public styles!: SedStyle[];

  @ApiProperty({ type: [SedModel] })
  @Type(() => SedModel)
  @ValidateNested({ each: true })
  public models!: SedModel[];

  @ApiProperty({
    type: 'array',
    items: {
      oneOf: [
        { $ref: getSchemaPath(SedOneStepSimulation) },
        { $ref: getSchemaPath(SedSteadyStateSimulation) },
        { $ref: getSchemaPath(SedUniformTimeCourseSimulation) },
      ],
    },
  })
  @Type(() => Object, {
    discriminator: {
      property: '_type',
      subTypes: [
        { value: SedOneStepSimulation, name: 'SedOneStepSimulation' },
        { value: SedSteadyStateSimulation, name: 'SedSteadyStateSimulation' },
        {
          value: SedUniformTimeCourseSimulation,
          name: 'SedUniformTimeCourseSimulation',
        },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  @ValidateNested({ each: true })
  public simulations!: SedSimulation[];

  @ApiProperty({ type: [SedDataGenerator] })
  @Type(() => SedDataGenerator)
  @ValidateNested({ each: true })
  public dataGenerators!: SedDataGenerator[];

  @ApiProperty({
    type: 'array',
    items: {
      oneOf: [
        { $ref: getSchemaPath(SedReport) },
        { $ref: getSchemaPath(SedPlot2D) },
        { $ref: getSchemaPath(SedPlot3D) },
      ],
    },
  })
  @Type(() => Object, {
    discriminator: {
      property: '_type',
      subTypes: [
        { value: SedReport, name: 'SedReport' },
        { value: SedPlot2D, name: 'SedPlot2D' },
        { value: SedPlot3D, name: 'SedPlot3D' },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  @ValidateNested({ each: true })
  public outputs!: SedOutput[];

  @ApiProperty({
    type: 'array',
    items: {
      oneOf: [
        { $ref: getSchemaPath(SedTask) },
        { $ref: getSchemaPath(SedRepeatedTask) },
      ],
    },
  })
  @Type(() => Object, {
    discriminator: {
      property: '_type',
      subTypes: [
        { value: SedTask, name: 'SedTask' },
        { value: SedRepeatedTask, name: 'SedRepeatedTask' },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  @ValidateNested({ each: true })
  public tasks!: SedAbstractTask[];
}

export class SimulationRunSedDocument
  extends SimulationRunSedDocumentInput
  implements ISimulationRunSedDocument
{
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  public simulationRun!: string;

  @ApiResponseProperty({
    type: String,
    format: 'date-time',
    // description: 'Timestamp when the specifications were created',
  })
  public created!: string;

  @ApiResponseProperty({
    type: String,
    format: 'date-time',
    // description: 'Timestamp when the specifications were last updated',
  })
  public updated!: string;
}

export class SimulationRunSedDocumentInputsContainer
  implements ISimulationRunSedDocumentInputsContainer
{
  @ApiProperty({
    description: 'SED-ML documents',
    type: [SimulationRunSedDocumentInput],
  })
  @ValidateNested({ each: true })
  @Type(() => SimulationRunSedDocumentInput)
  sedDocuments!: SimulationRunSedDocumentInput[];
}
