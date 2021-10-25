import { ApiProperty, ApiResponseProperty, getSchemaPath } from '@nestjs/swagger';
import {
  SimulationRunSedDocument as ISimulationRunSedDocument,
  SedModel as ISedModel,
  SedModelAttributeChange as ISedModelAttributeChange,
  SedOneStepSimulation as ISedOneStepSimulation,
  SedSteadyStateSimulation as ISedSteadyStateSimulation,
  SedUniformTimeCourseSimulation as ISedUniformTimeCourseSimulation,
  SedAlgorithm as ISedAlgorithm,
  SedAlgorithmParameterChange as ISedAlgorithmParameterChange,
  SedTask as ISedTask,
  SedRepeatedTask as ISedRepeatedTask,
  SedDataGenerator as ISedDataGenerator,
  SedReport as ISedReport,
  SedPlot2D as ISedPlot2D,
  SedPlot3D as ISedPlot3D,
  SedDataSet as ISedDataSet,
  SedCurve as ISedCurve,
  SedSurface as ISedSurface,
  SedVariable as ISedVariable,
  SedTarget as ISedTarget,
  Namespace as INamespace,
  SedAxisScale,
} from '@biosimulations/datamodel/common';

export class Namespace implements INamespace {
  @ApiProperty({ type: String, enum: ['Namespace'] })
  public _type!: 'Namespace';
  
  @ApiProperty({ type: String, example: 'sbml', required: false, nullable: true })
  public prefix?: string;
  
  @ApiProperty({ type: String, example: 'http://www.sbml.org/sbml/level2/version4' })
  public uri!: string;
}

export class SedTarget implements ISedTarget {
  @ApiProperty({ type: String, enum: ['SedTarget'] })
  public _type!: 'SedTarget';

  @ApiProperty({ type: String })
  public value!: string;

  @ApiProperty({ type: [Namespace], required: false, nullable: true })
  public namespaces?: Namespace[];
};

export class SedModelAttributeChange implements ISedModelAttributeChange {
  @ApiProperty({ type: String, enum: ['SedModelAttributeChange'] })
  public _type!: 'SedModelAttributeChange';

  @ApiProperty({ type: String })
  public id!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  public name?: string;

  @ApiProperty({ type: SedTarget })
  public target!: SedTarget;

  @ApiProperty({ type: String })
  public newValue!: string;
}

export type SedModelChange = SedModelAttributeChange;

export class SedModel implements ISedModel {
  @ApiProperty({ type: String, enum: ['SedModel'] })
  public _type!: 'SedModel';

  @ApiProperty({ type: String })
  public id!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  public name?: string;

  @ApiProperty({ type: String })
  public language!: string;

  @ApiProperty({ type: String })
  public source!: string;

  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(SedModelAttributeChange) },
    ],
  })
  public changes!: SedModelChange[];
}

export class SedAlgorithmParameterChange implements ISedAlgorithmParameterChange {
  @ApiProperty({ type: String, enum: ['SedAlgorithmParameterChange'] })
  public _type!: 'SedAlgorithmParameterChange';

  @ApiProperty({ type: String, example: 'KISAO_0000488', pattern: '^KISAO_\\d{7,7}$' })
  public kisaoId!: string;

  @ApiProperty({ type: String })
  public newValue!: string;
}

export class SedAlgorithm implements ISedAlgorithm {
  @ApiProperty({ type: String, enum: ['SedAlgorithm'] })
  public _type!: 'SedAlgorithm';

  @ApiProperty({ type: String, example: 'KISAO_0000019', pattern: '^KISAO_\\d{7,7}$' })
  public kisaoId!: string;

  @ApiProperty({ type: [SedAlgorithmParameterChange] })
  public changes!: SedAlgorithmParameterChange[];
}

export class SedUniformTimeCourseSimulation implements ISedUniformTimeCourseSimulation {
  @ApiProperty({ type: String, enum: ['SedUniformTimeCourseSimulation'] })
  public _type!: 'SedUniformTimeCourseSimulation';

  @ApiProperty({ type: String })
  public id!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  public name?: string;

  @ApiProperty({ type: Number })
  public initialTime!: number;

  @ApiProperty({ type: Number })
  public outputStartTime!: number;

  @ApiProperty({ type: Number })
  public outputEndTime!: number;

  @ApiProperty({ type: Number })
  public numberOfSteps!: number;

  @ApiProperty({ type: SedAlgorithm })
  public algorithm!: SedAlgorithm;
}

export class SedSteadyStateSimulation implements ISedSteadyStateSimulation {
  @ApiProperty({ type: String, enum: ['SedSteadyStateSimulation'] })
  public _type!: 'SedSteadyStateSimulation';

  @ApiProperty({ type: String })
  public id!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  public name?: string;

  @ApiProperty({ type: SedAlgorithm })
  public algorithm!: SedAlgorithm;
}

export class SedOneStepSimulation implements ISedOneStepSimulation {
  @ApiProperty({ type: String, enum: ['SedOneStepSimulation'] })
  public _type!: 'SedOneStepSimulation';

  @ApiProperty({ type: String })
  public id!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  public name?: string;

  @ApiProperty({ type: Number })
  public step!: number;

  @ApiProperty({ type: SedAlgorithm })
  public algorithm!: SedAlgorithm;
}

export type SedSimulation =
  | SedUniformTimeCourseSimulation
  | SedSteadyStateSimulation
  | SedOneStepSimulation;

export class SedTask implements ISedTask {
  @ApiProperty({ type: String, enum: ['SedTask'] })
  public _type!: 'SedTask';

  @ApiProperty({ type: String })
  public id!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  public name?: string;

  @ApiProperty({ type: SedModel })
  public model!: SedModel;

  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(SedUniformTimeCourseSimulation) },
      { $ref: getSchemaPath(SedSteadyStateSimulation) },
      { $ref: getSchemaPath(SedOneStepSimulation) },
    ],
  })
  public simulation!: SedSimulation;
}

export class SedRepeatedTask implements ISedRepeatedTask {
  @ApiProperty({ type: String, enum: ['SedRepeatedTask'] })
  public _type!: 'SedRepeatedTask';

  @ApiProperty({ type: String })
  public id!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  public name?: string;
}

export type SedAbstractTask = SedTask | SedRepeatedTask;

export class SedVariable implements ISedVariable {
  @ApiProperty({ type: String, enum: ['SedVariable'] })
  public _type!: 'SedVariable';

  @ApiProperty({ type: String })
  public id!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  public name?: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  public symbol?: string;

  @ApiProperty({ type: SedTarget, required: false, nullable: true })
  public target?: SedTarget;

  @ApiProperty({ type: SedTask })
  public task!: SedTask;
}

export class SedDataGenerator implements ISedDataGenerator {
  @ApiProperty({ type: String, enum: ['SedDataGenerator'] })
  public _type!: 'SedDataGenerator';

  @ApiProperty({ type: String })
  public id!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  public name?: string;

  @ApiProperty({ type: [SedVariable] })
  public variables!: SedVariable[];

  @ApiProperty({ type: String })
  public math!: string;
}

export class SedDataSet implements ISedDataSet {
  @ApiProperty({ type: String, enum: ['SedDataSet'] })
  public _type!: 'SedDataSet';

  @ApiProperty({ type: String })
  public id!: string;

  @ApiProperty({ type: SedDataGenerator })
  public dataGenerator!: SedDataGenerator;

  @ApiProperty({ type: String, required: false, nullable: true })
  public name?: string;

  @ApiProperty({ type: String })
  public label!: string;
}

export class SedReport implements ISedReport {
  @ApiProperty({ type: String, enum: ['SedReport'] })
  public _type!: 'SedReport';

  @ApiProperty({ type: String })
  public id!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  public name?: string;

  @ApiProperty({ type: [SedDataSet] })
  public dataSets!: SedDataSet[];
}

export class SedCurve implements ISedCurve {
  @ApiProperty({ type: String, enum: ['SedCurve'] })
  public _type!: 'SedCurve';

  @ApiProperty({ type: String })
  public id!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  public name?: string;

  @ApiProperty({ type: SedDataGenerator })
  public xDataGenerator!: SedDataGenerator;

  @ApiProperty({ type: SedDataGenerator })
  public yDataGenerator!: SedDataGenerator;
}

export class SedPlot2D implements ISedPlot2D {
  @ApiProperty({ type: String, enum: ['SedPlot2D'] })
  public _type!: 'SedPlot2D';

  @ApiProperty({ type: String })
  public id!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  public name?: string;

  @ApiProperty({ type: [SedCurve] })
  public curves!: SedCurve[];

  @ApiProperty({ type: String, enum: SedAxisScale })
  public xScale!: SedAxisScale;

  @ApiProperty({ type: String, enum: SedAxisScale })
  public yScale!: SedAxisScale;
}

export class SedSurface implements ISedSurface {
  @ApiProperty({ type: String, enum: ['SedSurface'] })
  public _type!: 'SedSurface';

  @ApiProperty({ type: String })
  public id!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  public name?: string;

  @ApiProperty({ type: SedDataGenerator })
  public xDataGenerator!: SedDataGenerator;

  @ApiProperty({ type: SedDataGenerator })
  public yDataGenerator!: SedDataGenerator;

  @ApiProperty({ type: SedDataGenerator })
  public zDataGenerator!: SedDataGenerator;
}

export class SedPlot3D implements ISedPlot3D {
  @ApiProperty({ type: String, enum: ['SedPlot3D'] })
  public _type!: 'SedPlot3D';

  @ApiProperty({ type: String })
  public id!: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  public name?: string;

  @ApiProperty({ type: [SedSurface] })
  public surfaces!: SedSurface[];

  @ApiProperty({ type: String, enum: SedAxisScale })
  public xScale!: SedAxisScale;

  @ApiProperty({ type: String, enum: SedAxisScale })
  public yScale!: SedAxisScale;

  @ApiProperty({ type: String, enum: SedAxisScale })
  public zScale!: SedAxisScale;
}

export type SedOutput = SedReport | SedPlot2D | SedPlot3D;

export class SimulationRunSedDocument implements ISimulationRunSedDocument {
  @ApiProperty({ type: String })
  public id!: string;

  @ApiProperty({ type: String })
  public simulationRun!: string;

  @ApiProperty({ type: [SedModel] })
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
  public simulations!: SedSimulation[];

  @ApiProperty({ type: [SedDataGenerator] })
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
  public outputs!: SedOutput[];

  @ApiProperty({ type: [SedTask] })
  public tasks!: SedTask[];

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
