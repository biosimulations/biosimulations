/*  No validation is implemented here because objects can only be created
 * from the output of the COMBINE API, and the COMBINE API already includes validation.
 */

import { ObjectIdValidator } from '@biosimulations/datamodel-database';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SimulationRunModel } from '../simulation-run/simulation-run.model';
import { Document, Schema as MongooseSchema } from 'mongoose';
import {
  SimulationRunSedDocument as ISimulationRunSedDocument,
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
  SerializedSedFunctionalRange as ISedFunctionalRange,
  SedUniformRange as ISedUniformRange,
  SedUniformRangeType,
  SedVectorRange as ISedVectorRange,
  SerializedSedSetValueComputeModelChange as ISedSetValueComputeModelChange,
  SerializedSedSubTask as ISedSubTask,
  SerializedSedDataGenerator as ISedDataGenerator,
  SerializedSedReport as ISedReport,
  SerializedSedPlot2D as ISedPlot2D,
  SerializedSedPlot3D as ISedPlot3D,
  SerializedSedDataSet as ISedDataSet,
  SerializedSedCurve as ISedCurve,
  SerializedSedSurface as ISedSurface,
  SedParameter as ISedParameter,
  SerializedSedVariable as ISedVariable,
  SedTarget as ISedTarget,
  Namespace as INamespace,
  SedAxisScale,
} from '@biosimulations/datamodel/common';

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class Namespace implements INamespace {
  @Prop({
    type: String,
    enum: ['Namespace'],
    required: true,
    default: undefined,
  })
  public _type!: 'Namespace';

  @Prop({ type: String, required: false, default: undefined })
  public prefix?: string;

  @Prop({ type: String, required: true, default: undefined })
  public uri!: string;
}

export const NamespaceSchema = SchemaFactory.createForClass(Namespace);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class SedTarget implements ISedTarget {
  @Prop({
    type: String,
    enum: ['SedTarget'],
    required: true,
    default: undefined,
  })
  public _type!: 'SedTarget';

  @Prop({ type: String, required: true, default: undefined })
  public value!: string;

  @Prop({ type: [NamespaceSchema], required: false, default: undefined })
  public namespaces?: Namespace[];
}

export const SedTargetSchema = SchemaFactory.createForClass(SedTarget);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class SedParameter implements ISedParameter {
  @Prop({
    type: String,
    enum: ['SedParameter'],
    required: true,
    default: undefined,
  })
  public _type!: 'SedParameter';

  @Prop({ type: String, required: true, default: undefined })
  public id!: string;

  @Prop({ type: String, required: false, default: undefined })
  public name?: string;

  @Prop({ type: Number, required: true, default: undefined })
  public value!: number;
}

export const SedParameterSchema = SchemaFactory.createForClass(SedParameter);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class SedVariable implements ISedVariable {
  @Prop({
    type: String,
    enum: ['SedVariable'],
    required: true,
    default: undefined,
  })
  public _type!: 'SedVariable';

  @Prop({ type: String, required: true, default: undefined })
  public id!: string;

  @Prop({ type: String, required: false, default: undefined })
  public name?: string;

  @Prop({ type: String, required: false, default: undefined })
  public symbol?: string;

  @Prop({ type: SedTargetSchema, required: false, default: undefined })
  public target?: SedTarget;

  @Prop({ type: String, required: true, default: undefined })
  public task!: string;

  @Prop({ type: String, required: false, default: undefined })
  public model?: string;
}

export const SedVariableSchema = SchemaFactory.createForClass(SedVariable);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class SedModelAttributeChange implements ISedModelAttributeChange {
  public _type!: 'SedModelAttributeChange';

  @Prop({ type: String, required: true, default: undefined })
  public id!: string;

  @Prop({ type: String, required: false, default: undefined })
  public name?: string;

  @Prop({ type: SedTargetSchema, required: true, default: undefined })
  public target!: SedTarget;

  @Prop({ type: String, required: true, default: undefined })
  public newValue!: string;
}

export const SedModelAttributeChangeSchema = SchemaFactory.createForClass(
  SedModelAttributeChange,
);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class SedAddElementModelChange implements ISedAddElementModelChange {
  public _type!: 'SedAddElementModelChange';

  @Prop({ type: String, required: true, default: undefined })
  public id!: string;

  @Prop({ type: String, required: false, default: undefined })
  public name?: string;

  @Prop({ type: SedTargetSchema, required: true, default: undefined })
  public target!: SedTarget;

  @Prop({ type: [String], required: true, default: undefined })
  public newElements!: string[];
}

export const SedAddElementModelChangeSchema = SchemaFactory.createForClass(
  SedAddElementModelChange,
);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class SedReplaceElementModelChange
  implements ISedReplaceElementModelChange
{
  public _type!: 'SedReplaceElementModelChange';

  @Prop({ type: String, required: true, default: undefined })
  public id!: string;

  @Prop({ type: String, required: false, default: undefined })
  public name?: string;

  @Prop({ type: SedTargetSchema, required: true, default: undefined })
  public target!: SedTarget;

  @Prop({ type: [String], required: true, default: undefined })
  public newElements!: string[];
}

export const SedReplaceElementModelChangeSchema = SchemaFactory.createForClass(
  SedReplaceElementModelChange,
);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class SedRemoveElementModelChange
  implements ISedRemoveElementModelChange
{
  public _type!: 'SedRemoveElementModelChange';

  @Prop({ type: String, required: true, default: undefined })
  public id!: string;

  @Prop({ type: String, required: false, default: undefined })
  public name?: string;

  @Prop({ type: SedTargetSchema, required: true, default: undefined })
  public target!: SedTarget;
}

export const SedRemoveElementModelChangeSchema = SchemaFactory.createForClass(
  SedRemoveElementModelChange,
);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class SedComputeModelChange implements ISedComputeModelChange {
  public _type!: 'SedComputeModelChange';

  @Prop({ type: String, required: true, default: undefined })
  public id!: string;

  @Prop({ type: String, required: false, default: undefined })
  public name?: string;

  @Prop({ type: SedTargetSchema, required: true, default: undefined })
  public target!: SedTarget;

  @Prop({ type: [SedParameterSchema], required: true, default: undefined })
  public parameters!: SedParameter[];

  @Prop({ type: [SedVariableSchema], required: true, default: undefined })
  public variables!: SedVariable[];

  @Prop({ type: String, required: true, default: undefined })
  public math!: string;
}

export const SedComputeModelChangeSchema = SchemaFactory.createForClass(
  SedComputeModelChange,
);

export type SedModelChangeType =
  | SedModelAttributeChange
  | SedAddElementModelChange
  | SedReplaceElementModelChange
  | SedRemoveElementModelChange
  | SedComputeModelChange;

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
  discriminatorKey: '_type',
})
export class SedModelChange {
  @Prop({
    type: String,
    enum: [
      SedModelAttributeChange.name,
      SedAddElementModelChange.name,
      SedReplaceElementModelChange.name,
      SedRemoveElementModelChange.name,
      SedComputeModelChange.name,
    ],
    required: true,
    default: undefined,
  })
  public _type!: string;

  @Prop({ type: String, required: true, default: undefined })
  public id!: string;

  @Prop({ type: String, required: false, default: undefined })
  public name?: string;

  @Prop({ type: SedTargetSchema, required: true, default: undefined })
  public target!: SedTarget;
}

export const SedModelChangeSchema =
  SchemaFactory.createForClass(SedModelChange);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class SedModel implements ISedModel {
  @Prop({
    type: String,
    enum: ['SedModel'],
    required: true,
    default: undefined,
  })
  public _type!: 'SedModel';

  @Prop({ type: String, required: true, default: undefined })
  public id!: string;

  @Prop({ type: String, required: false, default: undefined })
  public name?: string;

  @Prop({ type: String, required: true, default: undefined })
  public language!: string;

  @Prop({ type: String, required: true, default: undefined })
  public source!: string;

  @Prop({ type: [SedModelChangeSchema], required: true, default: undefined })
  public changes!: SedModelChangeType[];
}

export const SedModelSchema = SchemaFactory.createForClass(SedModel);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class SedAlgorithmParameterChange
  implements ISedAlgorithmParameterChange
{
  @Prop({
    type: String,
    enum: ['SedAlgorithmParameterChange'],
    required: true,
    default: undefined,
  })
  public _type!: 'SedAlgorithmParameterChange';

  @Prop({ type: String, required: true, default: undefined })
  public kisaoId!: string;

  @Prop({ type: String, required: true, default: undefined })
  public newValue!: string;
}

export const SedAlgorithmParameterChangeSchema = SchemaFactory.createForClass(
  SedAlgorithmParameterChange,
);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class SedAlgorithm implements ISedAlgorithm {
  @Prop({
    type: String,
    enum: ['SedAlgorithm'],
    required: true,
    default: undefined,
  })
  public _type!: 'SedAlgorithm';

  @Prop({ type: String, required: true, default: undefined })
  public kisaoId!: string;

  @Prop({
    type: [SedAlgorithmParameterChangeSchema],
    required: true,
    default: undefined,
  })
  public changes!: SedAlgorithmParameterChange[];
}

export const SedAlgorithmSchema = SchemaFactory.createForClass(SedAlgorithm);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class SedUniformTimeCourseSimulation
  implements ISedUniformTimeCourseSimulation
{
  public _type!: 'SedUniformTimeCourseSimulation';

  @Prop({ type: String, required: true, default: undefined })
  public id!: string;

  @Prop({ type: String, required: false, default: undefined })
  public name?: string;

  @Prop({ type: Number, required: true, default: undefined })
  public initialTime!: number;

  @Prop({ type: Number, required: true, default: undefined })
  public outputStartTime!: number;

  @Prop({ type: Number, required: true, default: undefined })
  public outputEndTime!: number;

  @Prop({ type: Number, required: true, default: undefined })
  public numberOfSteps!: number;

  @Prop({ type: SedAlgorithmSchema, required: true, default: undefined })
  public algorithm!: SedAlgorithm;
}

export const SedUniformTimeCourseSimulationSchema =
  SchemaFactory.createForClass(SedUniformTimeCourseSimulation);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class SedSteadyStateSimulation implements ISedSteadyStateSimulation {
  public _type!: 'SedSteadyStateSimulation';

  @Prop({ type: String, required: true, default: undefined })
  public id!: string;

  @Prop({ type: String, required: false, default: undefined })
  public name?: string;

  @Prop({ type: SedAlgorithmSchema, required: true, default: undefined })
  public algorithm!: SedAlgorithm;
}

export const SedSteadyStateSimulationSchema = SchemaFactory.createForClass(
  SedSteadyStateSimulation,
);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class SedOneStepSimulation implements ISedOneStepSimulation {
  public _type!: 'SedOneStepSimulation';

  @Prop({ type: String, required: true, default: undefined })
  public id!: string;

  @Prop({ type: String, required: false, default: undefined })
  public name?: string;

  @Prop({ type: Number, required: true, default: undefined })
  public step!: number;

  @Prop({ type: SedAlgorithmSchema, required: true, default: undefined })
  public algorithm!: SedAlgorithm;
}

export const SedOneStepSimulationSchema =
  SchemaFactory.createForClass(SedOneStepSimulation);

export type SedSimulationType =
  | SedUniformTimeCourseSimulation
  | SedSteadyStateSimulation
  | SedOneStepSimulation;

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
  discriminatorKey: '_type',
})
export class SedSimulation {
  @Prop({
    type: String,
    enum: [
      SedOneStepSimulation.name,
      SedSteadyStateSimulation.name,
      SedUniformTimeCourseSimulation.name,
    ],
    required: true,
    default: undefined,
  })
  public _type!: string;

  @Prop({ type: String, required: true, default: undefined })
  public id!: string;

  @Prop({ type: String, required: false, default: undefined })
  public name?: string;

  @Prop({ type: SedAlgorithmSchema, required: true, default: undefined })
  public algorithm!: SedAlgorithm;
}

export const SedSimulationSchema = SchemaFactory.createForClass(SedSimulation);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class SedTask implements ISedTask {
  public _type!: 'SedTask';

  @Prop({ type: String, required: true, default: undefined })
  public id!: string;

  @Prop({ type: String, required: false, default: undefined })
  public name?: string;

  @Prop({ type: String, required: true, default: undefined })
  public model!: string;

  @Prop({
    type: String,
    required: true,
    default: undefined,
  })
  public simulation!: string;
}

export const SedTaskSchema = SchemaFactory.createForClass(SedTask);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class SedFunctionalRange implements ISedFunctionalRange {
  public _type!: 'SedFunctionalRange';

  @Prop({ type: String, required: true, default: undefined })
  public id!: string;

  @Prop({ type: String, required: false, default: undefined })
  public name?: string;

  @Prop({ type: String, required: true, default: undefined })
  public range!: string;

  @Prop({ type: [SedParameterSchema], required: true, default: undefined })
  public parameters!: SedParameter[];

  @Prop({ type: [SedVariableSchema], required: true, default: undefined })
  public variables!: SedVariable[];

  @Prop({ type: String, required: true, default: undefined })
  public math!: string;
}

export const SedFunctionalRangeSchema =
  SchemaFactory.createForClass(SedFunctionalRange);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class SedUniformRange implements ISedUniformRange {
  public _type!: 'SedUniformRange';

  @Prop({ type: String, required: true, default: undefined })
  public id!: string;

  @Prop({ type: String, required: false, default: undefined })
  public name?: string;

  @Prop({ type: Number, required: true, default: undefined })
  public start!: number;

  @Prop({ type: Number, required: true, default: undefined })
  public end!: number;

  @Prop({ type: Number, required: true, default: undefined })
  public numberOfSteps!: number;

  @Prop({
    type: String,
    enum: SedUniformRangeType,
    required: true,
    default: undefined,
  })
  public type!: SedUniformRangeType;
}

export const SedUniformRangeSchema =
  SchemaFactory.createForClass(SedUniformRange);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class SedVectorRange implements ISedVectorRange {
  public _type!: 'SedVectorRange';

  @Prop({ type: String, required: true, default: undefined })
  public id!: string;

  @Prop({ type: String, required: false, default: undefined })
  public name?: string;

  @Prop({ type: [Number], required: true, default: undefined })
  public values!: number[];
}

export const SedVectorRangeSchema =
  SchemaFactory.createForClass(SedVectorRange);

export type SedRangeTypes =
  | SedFunctionalRange
  | SedUniformRange
  | SedVectorRange;

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
  discriminatorKey: '_type',
})
export class SedRange {
  @Prop({
    type: String,
    enum: [SedFunctionalRange.name, SedUniformRange.name, SedVectorRange.name],
    required: true,
    default: undefined,
  })
  public _type!: string;

  @Prop({ type: String, required: true, default: undefined })
  public id!: string;

  @Prop({ type: String, required: false, default: undefined })
  public name?: string;
}

export const SedRangeSchema = SchemaFactory.createForClass(SedRange);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class SedSetValueComputeModelChange
  implements ISedSetValueComputeModelChange
{
  public _type!: 'SedSetValueComputeModelChange';

  @Prop({ type: String, required: true, default: undefined })
  public id!: string;

  @Prop({ type: String, required: false, default: undefined })
  public name?: string;

  @Prop({ type: String, required: true, default: undefined })
  public model!: string;

  @Prop({ type: SedTargetSchema, required: true, default: undefined })
  public target!: SedTarget;

  @Prop({ type: String, required: false, default: undefined })
  public symbol?: string;

  @Prop({ type: String, required: false, default: undefined })
  public range?: string;

  @Prop({ type: [SedParameterSchema], required: true, default: undefined })
  public parameters!: SedParameter[];

  @Prop({ type: [SedVariableSchema], required: true, default: undefined })
  public variables!: SedVariable[];

  @Prop({ type: String, required: true, default: undefined })
  public math!: string;
}

export const SedSetValueComputeModelChangeSchema = SchemaFactory.createForClass(
  SedSetValueComputeModelChange,
);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class SedSubTask implements ISedSubTask {
  public _type!: 'SedSubTask';

  @Prop({ type: String, required: true, default: undefined })
  public task!: string;

  @Prop({ type: Number, required: true, default: undefined })
  public order!: number;
}

export const SedSubTaskSchema = SchemaFactory.createForClass(SedSubTask);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class SedRepeatedTask implements ISedRepeatedTask {
  public _type!: 'SedRepeatedTask';

  @Prop({ type: String, required: true, default: undefined })
  public id!: string;

  @Prop({ type: String, required: false, default: undefined })
  public name?: string;

  @Prop({ type: [SedRangeSchema], required: true, default: undefined })
  public ranges!: SedRangeTypes[];

  @Prop({ type: String, required: true, default: undefined })
  public range!: string;

  @Prop({ type: Boolean, required: true, default: undefined })
  public resetModelForEachIteration!: boolean;

  @Prop({
    type: [SedSetValueComputeModelChangeSchema],
    required: true,
    default: undefined,
  })
  public changes!: SedSetValueComputeModelChange[];

  @Prop({ type: [SedSubTaskSchema], required: true, default: undefined })
  public subTasks!: SedSubTask[];
}

export const SedRepeatedTaskSchema =
  SchemaFactory.createForClass(SedRepeatedTask);

export type SedAbstractTaskTypes = SedTask | SedRepeatedTask;

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
  discriminatorKey: '_type',
})
export class SedAbstractTask {
  @Prop({
    type: String,
    enum: [SedTask.name, SedRepeatedTask.name],
    required: true,
    default: undefined,
  })
  public _type!: string;

  @Prop({ type: String, required: true, default: undefined })
  public id!: string;

  @Prop({ type: String, required: false, default: undefined })
  public name?: string;
}

export const SedAbstractTaskSchema =
  SchemaFactory.createForClass(SedAbstractTask);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class SedDataGenerator implements ISedDataGenerator {
  @Prop({
    type: String,
    enum: ['SedDataGenerator'],
    required: true,
    default: undefined,
  })
  public _type!: 'SedDataGenerator';

  @Prop({ type: String, required: true, default: undefined })
  public id!: string;

  @Prop({ type: String, required: false, default: undefined })
  public name?: string;

  @Prop({ type: [SedParameterSchema], required: true, default: undefined })
  public parameters!: SedParameter[];

  @Prop({ type: [SedVariableSchema], required: true, default: undefined })
  public variables!: SedVariable[];

  @Prop({ type: String, required: true, default: undefined })
  public math!: string;
}

export const SedDataGeneratorSchema =
  SchemaFactory.createForClass(SedDataGenerator);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class SedDataSet implements ISedDataSet {
  @Prop({
    type: String,
    enum: ['SedDataSet'],
    required: true,
    default: undefined,
  })
  public _type!: 'SedDataSet';

  @Prop({ type: String, required: true, default: undefined })
  public id!: string;

  @Prop({ type: String, required: true, default: undefined })
  public dataGenerator!: string;

  @Prop({ type: String, required: false, default: undefined })
  public name?: string;

  @Prop({ type: String, required: true, default: undefined })
  public label!: string;
}

export const SedDataSetSchema = SchemaFactory.createForClass(SedDataSet);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class SedReport implements ISedReport {
  public _type!: 'SedReport';

  @Prop({ type: String, required: true, default: undefined })
  public id!: string;

  @Prop({ type: String, required: false, default: undefined })
  public name?: string;

  @Prop({ type: [SedDataSetSchema], required: true, default: undefined })
  public dataSets!: SedDataSet[];
}

export const SedReportSchema = SchemaFactory.createForClass(SedReport);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class SedCurve implements ISedCurve {
  @Prop({
    type: String,
    enum: ['SedCurve'],
    required: true,
    default: undefined,
  })
  public _type!: 'SedCurve';

  @Prop({ type: String, required: true, default: undefined })
  public id!: string;

  @Prop({ type: String, required: false, default: undefined })
  public name?: string;

  @Prop({ type: String, required: true, default: undefined })
  public xDataGenerator!: string;

  @Prop({ type: String, required: true, default: undefined })
  public yDataGenerator!: string;
}

export const SedCurveSchema = SchemaFactory.createForClass(SedCurve);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class SedPlot2D implements ISedPlot2D {
  public _type!: 'SedPlot2D';

  @Prop({ type: String, required: true, default: undefined })
  public id!: string;

  @Prop({ type: String, required: false, default: undefined })
  public name?: string;

  @Prop({ type: [SedCurveSchema], required: true, default: undefined })
  public curves!: SedCurve[];

  @Prop({
    type: String,
    enum: SedAxisScale,
    required: true,
    default: undefined,
  })
  public xScale!: SedAxisScale;

  @Prop({
    type: String,
    enum: SedAxisScale,
    required: true,
    default: undefined,
  })
  public yScale!: SedAxisScale;
}

export const SedPlot2DSchema = SchemaFactory.createForClass(SedPlot2D);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class SedSurface implements ISedSurface {
  @Prop({
    type: String,
    enum: ['SedSurface'],
    required: true,
    default: undefined,
  })
  public _type!: 'SedSurface';

  @Prop({ type: String, required: true, default: undefined })
  public id!: string;

  @Prop({ type: String, required: false, default: undefined })
  public name?: string;

  @Prop({ type: String, required: true, default: undefined })
  public xDataGenerator!: string;

  @Prop({ type: String, required: true, default: undefined })
  public yDataGenerator!: string;

  @Prop({ type: String, required: true, default: undefined })
  public zDataGenerator!: string;
}

export const SedSurfaceSchema = SchemaFactory.createForClass(SedSurface);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class SedPlot3D implements ISedPlot3D {
  public _type!: 'SedPlot3D';

  @Prop({ type: String, required: true, default: undefined })
  public id!: string;

  @Prop({ type: String, required: false, default: undefined })
  public name?: string;

  @Prop({ type: [SedSurfaceSchema], required: true, default: undefined })
  public surfaces!: SedSurface[];

  @Prop({
    type: String,
    enum: SedAxisScale,
    required: true,
    default: undefined,
  })
  public xScale!: SedAxisScale;

  @Prop({
    type: String,
    enum: SedAxisScale,
    required: true,
    default: undefined,
  })
  public yScale!: SedAxisScale;

  @Prop({
    type: String,
    enum: SedAxisScale,
    required: true,
    default: undefined,
  })
  public zScale!: SedAxisScale;
}

export const SedPlot3DSchema = SchemaFactory.createForClass(SedPlot3D);

export type SedOutputType = SedReport | SedPlot2D | SedPlot3D;

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
  discriminatorKey: '_type',
})
export class SedOutput {
  @Prop({
    type: String,
    required: true,
    enum: [SedReport.name, SedPlot2D.name, SedPlot3D.name],
    default: undefined,
  })
  public _type!: string;

  @Prop({ type: String, required: true, default: undefined })
  public id!: string;

  @Prop({ type: String, required: false, default: undefined })
  public name?: string;
}

export const SedOutputSchema = SchemaFactory.createForClass(SedOutput);

@Schema({
  storeSubdocValidationError: false,
  collection: 'Specifications',
  strict: true,
  id: false,
})
export class SpecificationsModel
  extends Document
  implements ISimulationRunSedDocument
{
  @Prop({
    required: true,
    default: undefined,
    index: true,
    immutable: true,
    type: String,
  })
  public id!: string;

  @Prop({
    required: true,
    type: String,
    immutable: true,
    ref: SimulationRunModel.name,
    validate: ObjectIdValidator,
    index: true,
  })
  public simulationRun!: string;

  @Prop({
    type: Number,
    required: true,
    default: undefined,
  })
  public level!: number;

  @Prop({
    type: Number,
    required: true,
    default: undefined,
  })
  public version!: number;

  @Prop({
    type: [SedOutputSchema],
    required: true,
    default: undefined,
  })
  public outputs!: SedOutputType[];

  @Prop({
    type: [SedAbstractTaskSchema],
    required: true,
    default: undefined,
  })
  public tasks!: SedAbstractTaskTypes[];

  @Prop({
    Type: [SedDataGeneratorSchema],
    required: true,
    default: undefined,
  })
  public dataGenerators!: SedDataGenerator[];

  @Prop({
    type: [SedModelSchema],
    required: true,
    default: undefined,
  })
  public models!: SedModel[];

  @Prop({
    type: [SedSimulationSchema],
    required: true,
    default: undefined,
  })
  public simulations!: SedSimulationType[];

  public created!: string;
  public updated!: string;
}

export const SpecificationsModelSchema =
  SchemaFactory.createForClass(SpecificationsModel);

SpecificationsModelSchema.set('timestamps', {
  createdAt: 'created',
  updatedAt: 'updated',
});

SedSimulationSchema.discriminators = {};
SedSimulationSchema.discriminators[SedOneStepSimulation.name] =
  SedOneStepSimulationSchema;
SedSimulationSchema.discriminators[SedSteadyStateSimulation.name] =
  SedSteadyStateSimulationSchema;
SedSimulationSchema.discriminators[SedUniformTimeCourseSimulation.name] =
  SedUniformTimeCourseSimulationSchema;

const sedSimulationsArraySchema = SpecificationsModelSchema.path(
  'simulations',
) as MongooseSchema.Types.DocumentArray;
sedSimulationsArraySchema.discriminator(
  SedOneStepSimulation.name,
  SedOneStepSimulationSchema,
);
sedSimulationsArraySchema.discriminator(
  SedSteadyStateSimulation.name,
  SedSteadyStateSimulationSchema,
);
sedSimulationsArraySchema.discriminator(
  SedUniformTimeCourseSimulation.name,
  SedUniformTimeCourseSimulationSchema,
);

SedModelChangeSchema.discriminators = {};
SedModelChangeSchema.discriminators[SedModelAttributeChange.name] =
  SedModelAttributeChangeSchema;
SedModelChangeSchema.discriminators[SedAddElementModelChange.name] =
  SedAddElementModelChangeSchema;
SedModelChangeSchema.discriminators[SedReplaceElementModelChange.name] =
  SedReplaceElementModelChangeSchema;
SedModelChangeSchema.discriminators[SedRemoveElementModelChange.name] =
  SedRemoveElementModelChangeSchema;
SedModelChangeSchema.discriminators[SedComputeModelChange.name] =
  SedComputeModelChangeSchema;

const sedModelChangeArraySchema = SedModelSchema.path(
  'changes',
) as MongooseSchema.Types.DocumentArray;
sedModelChangeArraySchema.discriminator(
  SedModelAttributeChange.name,
  SedModelAttributeChangeSchema,
);
sedModelChangeArraySchema.discriminator(
  SedAddElementModelChange.name,
  SedAddElementModelChangeSchema,
);
sedModelChangeArraySchema.discriminator(
  SedReplaceElementModelChange.name,
  SedReplaceElementModelChangeSchema,
);
sedModelChangeArraySchema.discriminator(
  SedRemoveElementModelChange.name,
  SedRemoveElementModelChangeSchema,
);
sedModelChangeArraySchema.discriminator(
  SedComputeModelChange.name,
  SedComputeModelChangeSchema,
);

SedRangeSchema.discriminators = {};
SedRangeSchema.discriminators[SedFunctionalRange.name] =
  SedFunctionalRangeSchema;
SedRangeSchema.discriminators[SedUniformRange.name] = SedUniformRangeSchema;
SedRangeSchema.discriminators[SedVectorRange.name] = SedVectorRangeSchema;

const sedRangeArraySchema = SedRepeatedTaskSchema.path(
  'ranges',
) as MongooseSchema.Types.DocumentArray;
sedRangeArraySchema.discriminator(
  SedFunctionalRange.name,
  SedFunctionalRangeSchema,
);
sedRangeArraySchema.discriminator(SedUniformRange.name, SedUniformRangeSchema);
sedRangeArraySchema.discriminator(SedVectorRange.name, SedVectorRangeSchema);

SedAbstractTaskSchema.discriminators = {};
SedAbstractTaskSchema.discriminators[SedTask.name] = SedTaskSchema;
SedAbstractTaskSchema.discriminators[SedRepeatedTask.name] =
  SedRepeatedTaskSchema;

const sedTasksArraySchema = SpecificationsModelSchema.path(
  'tasks',
) as MongooseSchema.Types.DocumentArray;
sedTasksArraySchema.discriminator(SedTask.name, SedTaskSchema);
sedTasksArraySchema.discriminator(SedRepeatedTask.name, SedRepeatedTaskSchema);

SedOutputSchema.discriminators = {};
SedOutputSchema.discriminators[SedReport.name] = SedReportSchema;
SedOutputSchema.discriminators[SedPlot2D.name] = SedPlot2DSchema;
SedOutputSchema.discriminators[SedPlot3D.name] = SedPlot3DSchema;

const sedOutputsArraySchema = SpecificationsModelSchema.path(
  'outputs',
) as MongooseSchema.Types.DocumentArray;
sedOutputsArraySchema.discriminator(SedReport.name, SedReportSchema);
sedOutputsArraySchema.discriminator(SedPlot2D.name, SedPlot2DSchema);
sedOutputsArraySchema.discriminator(SedPlot3D.name, SedPlot3DSchema);
