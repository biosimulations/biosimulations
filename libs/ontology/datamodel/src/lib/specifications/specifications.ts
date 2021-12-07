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
  SerializedSedModel as ISedModel,
  SedModelAttributeChange as ISedModelAttributeChange,
  SedAddElementModelChange as ISedAddElementModelChange,
  SedReplaceElementModelChange as ISedReplaceElementModelChange,
  SedRemoveElementModelChange as ISedRemoveElementModelChange,
  SerializedSedComputeModelChange as ISedComputeModelChange,
  SedOneStepSimulation as ISedOneStepSimulation,
  SedSteadyStateSimulation as ISedSteadyStateSimulation,
  SedUniformTimeCourseSimulation as ISedUniformTimeCourseSimulation,
  SedAlgorithm as ISedAlgorithm,
  SedAlgorithmParameterChange as ISedAlgorithmParameterChange,
  SerializedSedTask as ISedTask,
  SerializedSedRepeatedTask as ISedRepeatedTask,
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
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsOntologyTerm } from '@biosimulations/ontology/utils';

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
  @IsString()
  public value!: string;

  @ApiProperty({ type: [Namespace], required: false, nullable: true })
  @Type(() => Namespace)
  @ValidateNested({ each: true })
  public namespaces?: Namespace[];
}

export class SedParameter implements ISedParameter {
  @ApiProperty({ type: String, enum: ['SedParameter'] })
  @Equals('SedParameter')
  public _type!: 'SedParameter';

  @ApiProperty({ type: String })
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
  @IsString()
  public id!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsOptional()
  @IsString()
  public name?: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsOptional()
  @IsString()
  public symbol?: string;

  @ApiProperty({ type: SedTarget, required: false, nullable: true })
  @ValidateNested()
  @Type(() => SedTarget)
  public target?: SedTarget;

  @ApiProperty({ type: String })
  @IsString()
  public task!: string;
}

export class SedModelAttributeChange implements ISedModelAttributeChange {
  @ApiProperty({ type: String, enum: ['SedModelAttributeChange'] })
  @Equals('SedModelAttributeChange')
  public _type!: 'SedModelAttributeChange';

  @ApiProperty({ type: String })
  @IsString()
  public id!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsOptional()
  @IsString()
  public name?: string;

  @ApiProperty({ type: SedTarget })
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
  @IsString()
  public id!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsOptional()
  @IsString()
  public name?: string;

  @ApiProperty({ type: SedTarget })
  @ValidateNested()
  @Type(() => SedTarget)
  public target!: SedTarget;

  @ApiProperty({ type: [String] })
  @IsString()
  public newElements!: string[];
}

export class SedReplaceElementModelChange implements ISedReplaceElementModelChange {
  @ApiProperty({ type: String, enum: ['SedReplaceElementModelChange'] })
  @Equals('SedReplaceElementModelChange')
  public _type!: 'SedReplaceElementModelChange';

  @ApiProperty({ type: String })
  @IsString()
  public id!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsOptional()
  @IsString()
  public name?: string;

  @ApiProperty({ type: SedTarget })
  @ValidateNested()
  @Type(() => SedTarget)
  public target!: SedTarget;

  @ApiProperty({ type: [String] })
  @IsString()
  public newElements!: string[];
}

export class SedRemoveElementModelChange implements ISedRemoveElementModelChange {
  @ApiProperty({ type: String, enum: ['SedRemoveElementModelChange'] })
  @Equals('SedRemoveElementModelChange')
  public _type!: 'SedRemoveElementModelChange';

  @ApiProperty({ type: String })
  @IsString()
  public id!: string;

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
  @IsString()
  public id!: string;

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
  @IsString()
  public id!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsOptional()
  @IsString()
  public name?: string;

  @ApiProperty({ type: String })
  @IsString()
  public language!: string;

  @ApiProperty({ type: String })
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
        { value: SedReplaceElementModelChange, name: 'SedReplaceElementModelChange' },
        { value: SedRemoveElementModelChange, name: 'SedRemoveElementModelChange' },
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
  @IsString()
  public id!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsOptional()
  @IsString()
  public name?: string;

  @ApiProperty({ type: String })
  @IsString()
  public model!: string;

  @ApiProperty({ type: String })
  @IsString()
  public simulation!: string;
}

export class SedRepeatedTask implements ISedRepeatedTask {
  @ApiProperty({ type: String, enum: ['SedRepeatedTask'] })
  @Equals('SedRepeatedTask')
  public _type!: 'SedRepeatedTask';

  @ApiProperty({ type: String })
  @IsString()
  public id!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsOptional()
  @IsString()
  public name?: string;
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
  @IsString()
  public math!: string;
}

export class SedDataSet implements ISedDataSet {
  @ApiProperty({ type: String, enum: ['SedDataSet'] })
  @Equals('SedDataSet')
  public _type!: 'SedDataSet';

  @ApiProperty({ type: String })
  @IsString()
  public id!: string;

  @ApiProperty({ type: String })
  @IsString()
  public dataGenerator!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsOptional()
  @IsString()
  public name?: string;

  @ApiProperty({ type: String })
  @IsString()
  public label!: string;
}

export class SedReport implements ISedReport {
  @ApiProperty({ type: String, enum: ['SedReport'] })
  @Equals('SedReport')
  public _type!: 'SedReport';

  @ApiProperty({ type: String })
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
  @IsString()
  public id!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsOptional()
  @IsString()
  public name?: string;

  @ApiProperty({ type: String })
  @IsString()
  public xDataGenerator!: string;

  @ApiProperty({ type: String })
  @IsString()
  public yDataGenerator!: string;
}

export class SedPlot2D implements ISedPlot2D {
  @ApiProperty({ type: String, enum: ['SedPlot2D'] })
  @Equals('SedPlot2D')
  public _type!: 'SedPlot2D';

  @ApiProperty({ type: String })
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
  @IsString()
  public id!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  @IsOptional()
  @IsString()
  public name?: string;

  @ApiProperty({ type: String })
  @IsString()
  public xDataGenerator!: string;

  @ApiProperty({ type: String })
  @IsString()
  public yDataGenerator!: string;

  @ApiProperty({ type: String })
  @IsString()
  public zDataGenerator!: string;
}

export class SedPlot3D implements ISedPlot3D {
  @ApiProperty({ type: String, enum: ['SedPlot3D'] })
  @Equals('SedPlot3D')
  public _type!: 'SedPlot3D';

  @ApiProperty({ type: String })
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
    description: 'SED documents',
    type: [SimulationRunSedDocumentInput],
  })
  @ValidateNested({ each: true })
  @Type(() => SimulationRunSedDocumentInput)
  sedDocuments!: SimulationRunSedDocumentInput[];
}
