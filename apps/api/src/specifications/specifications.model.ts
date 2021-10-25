/*  No validation is implemented here because objects can only be created
 * from the output of the COMBINE API, and the COMBINE API already includes validation.
 */

import { ObjectIdValidator } from '@biosimulations/datamodel-database';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SimulationRunModel } from '../simulation-run/simulation-run.model';
import { Document, Schema as MongooseSchema } from 'mongoose';
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

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class Namespace implements INamespace {
  @Prop({ type: String, enum: ['Namespace'], required: true, default: undefined })
  public _type!: 'Namespace';
  
  @Prop({ type: String, required: false, default: undefined })
  public prefix?: string;
  
  @Prop({ type: String, required: true, default: undefined })
  public uri!: string;
}

export const NamespaceSchema =
  SchemaFactory.createForClass(Namespace);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class SedTarget implements ISedTarget {
  @Prop({ type: String, enum: ['SedTarget'], required: true, default: undefined })
  public _type!: 'SedTarget';

  @Prop({ type: String, required: true, default: undefined })
  public value!: string;

  @Prop({ type: [NamespaceSchema], required: false, default: undefined })
  public namespaces?: Namespace[];
};

export const SedTargetSchema =
  SchemaFactory.createForClass(SedTarget);

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

export const SedModelAttributeChangeSchema =
  SchemaFactory.createForClass(SedModelAttributeChange);

export type SedModelChangeType = SedModelAttributeChange;

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class SedModelChange {
  @Prop({ type: String, enum: [SedModelAttributeChange.name], required: true, default: undefined })
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
  @Prop({ type: String, enum: ['SedModel'], required: true, default: undefined })
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

export const SedModelSchema =
  SchemaFactory.createForClass(SedModel);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class SedAlgorithmParameterChange implements ISedAlgorithmParameterChange {
  @Prop({ type: String, enum: ['SedAlgorithmParameterChange'], required: true, default: undefined })
  public _type!: 'SedAlgorithmParameterChange';

  @Prop({ type: String, required: true, default: undefined })
  public kisaoId!: string;

  @Prop({ type: String, required: true, default: undefined })
  public newValue!: string;
}

export const SedAlgorithmParameterChangeSchema =
  SchemaFactory.createForClass(SedAlgorithmParameterChange);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class SedAlgorithm implements ISedAlgorithm {
  @Prop({ type: String, enum: ['SedAlgorithm'], required: true, default: undefined })
  public _type!: 'SedAlgorithm';

  @Prop({ type: String, required: true, default: undefined })
  public kisaoId!: string;

  @Prop({ type: [SedAlgorithmParameterChangeSchema], required: true, default: undefined })
  public changes!: SedAlgorithmParameterChange[];
}

export const SedAlgorithmSchema =
  SchemaFactory.createForClass(SedAlgorithm);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class SedUniformTimeCourseSimulation implements ISedUniformTimeCourseSimulation {
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

export const SedSteadyStateSimulationSchema =
  SchemaFactory.createForClass(SedSteadyStateSimulation);

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

export type SedSimulationTypes =
  | SedUniformTimeCourseSimulation
  | SedSteadyStateSimulation
  | SedOneStepSimulation;

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
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

export const SedSimulationSchema =
  SchemaFactory.createForClass(SedSimulation);

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

  @Prop({ type: SedModelSchema, required: true, default: undefined })
  public model!: SedModel;

  @Prop({
    type: SedSimulationSchema,
    required: true,
    default: undefined,
  })
  public simulation!: SedSimulationTypes;
}

export const SedTaskSchema =
  SchemaFactory.createForClass(SedTask);

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
}

export const SedRepeatedTaskSchema =
  SchemaFactory.createForClass(SedRepeatedTask);

export type SedAbstractTaskTypes = SedTask | SedRepeatedTask;

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class SedAbstractTask {
  @Prop({
    type: String,
    enum: [
      SedTask.name,
      SedRepeatedTask.name,
    ],
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
export class SedVariable implements ISedVariable {
  @Prop({ type: String, enum: ['SedVariable'], required: true, default: undefined })
  public _type!: 'SedVariable';

  @Prop({ type: String, required: true, default: undefined })
  public id!: string;

  @Prop({ type: String, required: false, default: undefined })
  public name?: string;

  @Prop({ type: String, required: false, default: undefined })
  public symbol?: string;

  @Prop({ type: SedTargetSchema, required: false, default: undefined })
  public target?: SedTarget;

  @Prop({ type: SedTaskSchema, required: true, default: undefined })
  public task!: SedTask;
}

export const SedVariableSchema =
  SchemaFactory.createForClass(SedVariable);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class SedDataGenerator implements ISedDataGenerator {
  @Prop({ type: String, enum: ['SedDataGenerator'], required: true, default: undefined })
  public _type!: 'SedDataGenerator';

  @Prop({ type: String, required: true, default: undefined })
  public id!: string;

  @Prop({ type: String, required: false, default: undefined })
  public name?: string;

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
  @Prop({ type: String, enum: ['SedDataSet'], required: true, default: undefined })
  public _type!: 'SedDataSet';

  @Prop({ type: String, required: true, default: undefined })
  public id!: string;

  @Prop({ type: SedDataGeneratorSchema, required: true, default: undefined })
  public dataGenerator!: SedDataGenerator;

  @Prop({ type: String, required: false, default: undefined })
  public name?: string;

  @Prop({ type: String, required: true, default: undefined })
  public label!: string;
}

export const SedDataSetSchema =
  SchemaFactory.createForClass(SedDataSet);

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

export const SedReportSchema =
  SchemaFactory.createForClass(SedReport);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class SedCurve implements ISedCurve {
  @Prop({ type: String, enum: ['SedCurve'], required: true, default: undefined })
  public _type!: 'SedCurve';

  @Prop({ type: String, required: true, default: undefined })
  public id!: string;

  @Prop({ type: String, required: false, default: undefined })
  public name?: string;

  @Prop({ type: SedDataGeneratorSchema, required: true, default: undefined })
  public xDataGenerator!: SedDataGenerator;

  @Prop({ type: SedDataGeneratorSchema, required: true, default: undefined })
  public yDataGenerator!: SedDataGenerator;
}

export const SedCurveSchema =
  SchemaFactory.createForClass(SedCurve);

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

  @Prop({ type: String, enum: SedAxisScale, required: true, default: undefined })
  public xScale!: SedAxisScale;

  @Prop({ type: String, enum: SedAxisScale, required: true, default: undefined })
  public yScale!: SedAxisScale;
}

export const SedPlot2DSchema =
  SchemaFactory.createForClass(SedPlot2D);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class SedSurface implements ISedSurface {
  @Prop({ type: String, enum: ['SedSurface'], required: true, default: undefined })
  public _type!: 'SedSurface';

  @Prop({ type: String, required: true, default: undefined })
  public id!: string;

  @Prop({ type: String, required: false, default: undefined })
  public name?: string;

  @Prop({ type: SedDataGeneratorSchema, required: true, default: undefined })
  public xDataGenerator!: SedDataGenerator;

  @Prop({ type: SedDataGeneratorSchema, required: true, default: undefined })
  public yDataGenerator!: SedDataGenerator;

  @Prop({ type: SedDataGeneratorSchema, required: true, default: undefined })
  public zDataGenerator!: SedDataGenerator;
}

export const SedSurfaceSchema =
  SchemaFactory.createForClass(SedSurface);

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

  @Prop({ type: String, enum: SedAxisScale, required: true, default: undefined })
  public xScale!: SedAxisScale;

  @Prop({ type: String, enum: SedAxisScale, required: true, default: undefined })
  public yScale!: SedAxisScale;

  @Prop({ type: String, enum: SedAxisScale, required: true, default: undefined })
  public zScale!: SedAxisScale;
}

export const SedPlot3DSchema =
  SchemaFactory.createForClass(SedPlot3D);

export type SedOutputType = SedReport | SedPlot2D | SedPlot3D;

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
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

export const SedOutputSchema =
  SchemaFactory.createForClass(SedOutput);

@Schema({
  storeSubdocValidationError: false,
  collection: 'Specifications',
  strict: true,
  id: false,
})
export class SpecificationsModel extends Document implements ISimulationRunSedDocument {
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
    type: [SedOutputSchema],
    required: true,
    default: undefined,
  })
  public outputs!: SedOutputType[];

  @Prop({
    type: [SedTaskSchema],
    required: true,
    default: undefined,
  })
  public tasks!: SedTask[];

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
  public simulations!: SedSimulationTypes[];

  public created!: string;
  public updated!: string;
}

export const SpecificationsModelSchema =
  SchemaFactory.createForClass(SpecificationsModel);

SpecificationsModelSchema.set('timestamps', {
  createdAt: 'created',
  updatedAt: 'updated',
});

const sedSimulationsArraySchema = SpecificationsModelSchema.path('simulations') as MongooseSchema.Types.DocumentArray;
sedSimulationsArraySchema.discriminator(SedOneStepSimulation.name, SedOneStepSimulationSchema);
sedSimulationsArraySchema.discriminator(SedSteadyStateSimulation.name, SedSteadyStateSimulationSchema);
sedSimulationsArraySchema.discriminator(SedUniformTimeCourseSimulation.name, SedUniformTimeCourseSimulationSchema);

const sedOutputsArraySchema = SpecificationsModelSchema.path('outputs') as MongooseSchema.Types.DocumentArray;
sedOutputsArraySchema.discriminator(SedReport.name, SedReportSchema);
sedOutputsArraySchema.discriminator(SedPlot2D.name, SedPlot2DSchema);
sedOutputsArraySchema.discriminator(SedPlot3D.name, SedPlot3DSchema);
