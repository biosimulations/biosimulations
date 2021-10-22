/**
 * @file The mongoose model for the a log object. Contains logging output and a pointer to the original simulation run
 * @author Bilal Shaikh
 * @copyright Biosimulations Team, 2021
 * @license MIT
 */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import {
  CombineArchiveLog as ICombineArchiveLog,
  SedDocumentLog as ISedDocumentLog,
  SedTaskLog as ISedTaskLog,
  SimulatorDetail as ISimulatorDetail,
  SedOutputLog as ISedOutputLog,
  SedReportLog as ISedReportLog,
  SedPlot2DLog as ISedPlot2DLog,
  SedPlot3DLog as ISedPlot3DLog,
  SedOutputElementLog as ISedOutputElementLog,
  SimulationRunLogStatus,
  Exception as IException,
} from '@biosimulations/datamodel/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document, Schema as MongooseSchema } from 'mongoose';
import { ObjectIdValidator } from '@biosimulations/datamodel-database';
import { SimulationRunModel } from '../simulation-run/simulation-run.model';
import {
  Ontologies,
  KisaoIdRegEx,
} from '@biosimulations/datamodel/common';
import { OntologiesService } from '@biosimulations/ontology/ontologies';
// import { addValidationForNullableAttributes } from '@biosimulations/datamodel-database';

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class Exception implements IException {
  @Prop({ type: String, required: true, default: undefined })
  category!: string;

  @Prop({ type: String, required: true, default: undefined })
  message!: string;
}
export const ExceptionSchema =
  SchemaFactory.createForClass(Exception);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class SedOutputElementLog implements ISedOutputElementLog{
  @Prop({ type: String, required: true, default: undefined })
  id!: string;

  @Prop({
    type: String,
    enum: Object.entries(SimulationRunLogStatus).map(
      (keyVal: [string, string]): string => {
        return keyVal[1];
      },
    ),
    required: true,
    default: undefined,
  })
  status!: SimulationRunLogStatus;
}
export const SedOutputElementLogSchema =
  SchemaFactory.createForClass(SedOutputElementLog);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class SedReportLog implements ISedReportLog {
  _type!: string;

  @Prop({ type: String, required: true, default: undefined })
  id!: string;

  @Prop({
    type: String,
    enum: Object.entries(SimulationRunLogStatus).map(
      (keyVal: [string, string]): string => {
        return keyVal[1];
      },
    ),
    required: true,
    default: undefined,
  })
  status!: SimulationRunLogStatus;

  @Prop({ type: ExceptionSchema, required: false, default: undefined })
  exception!: IException | null;

  @Prop({ type: ExceptionSchema, required: false, default: undefined })
  skipReason!: IException | null;

  @Prop({ type: String, required: false, default: undefined })
  output!: string | null;

  @Prop({ type: Number, required: false, default: undefined })
  duration!: number | null;

  @Prop({ type: [SedOutputElementLogSchema], required: false, default: undefined })
  dataSets!: ISedOutputElementLog[] | null;
}
export const SedReportLogSchema =
  SchemaFactory.createForClass(SedReportLog);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class SedPlot2DLog implements ISedPlot2DLog {
  _type!: string;

  @Prop({ type: String, required: true, default: undefined })
  id!: string;

  @Prop({
    type: String,
    enum: Object.entries(SimulationRunLogStatus).map(
      (keyVal: [string, string]): string => {
        return keyVal[1];
      },
    ),
    required: true,
    default: undefined,
  })
  status!: SimulationRunLogStatus;

  @Prop({ type: ExceptionSchema, required: false, default: undefined })
  exception!: IException | null;

  @Prop({ type: ExceptionSchema, required: false, default: undefined })
  skipReason!: IException | null;

  @Prop({ type: String, required: false, default: undefined })
  output!: string | null;

  @Prop({ type: Number, required: false, default: undefined })
  duration!: number | null;

  @Prop({ type: [SedOutputElementLogSchema], required: false, default: undefined })
  curves!: ISedOutputElementLog[] | null;
}
export const SedPlot2DLogSchema =
  SchemaFactory.createForClass(SedPlot2DLog);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class SedPlot3DLog implements ISedPlot3DLog {
  _type!: string;

  @Prop({ type: String, required: true, default: undefined })
  id!: string;

  @Prop({
    type: String,
    enum: Object.entries(SimulationRunLogStatus).map(
      (keyVal: [string, string]): string => {
        return keyVal[1];
      },
    ),
    required: true,
    default: undefined,
  })
  status!: SimulationRunLogStatus;

  @Prop({ type: ExceptionSchema, required: false, default: undefined })
  exception!: IException | null;

  @Prop({ type: ExceptionSchema, required: false, default: undefined })
  skipReason!: IException | null;

  @Prop({ type: String, required: false, default: undefined })
  output!: string | null;

  @Prop({ type: Number, required: false, default: undefined })
  duration!: number | null;

  @Prop({ type: [SedOutputElementLogSchema], required: false, default: undefined })
  surfaces!: ISedOutputElementLog[] | null;
}
export const SedPlot3DLogSchema =
  SchemaFactory.createForClass(SedPlot3DLog);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
  discriminatorKey: '_type',
})
export class SedOutputLog implements ISedOutputLog {
  @Prop({
    type: String,
    required: true,
    enum: [SedReportLog.name, SedPlot2DLog.name, SedPlot3DLog.name],
    default: undefined,
  })
  _type!: string;

  @Prop({ type: String, required: true, default: undefined })
  id!: string;

  @Prop({
    type: String,
    enum: Object.entries(SimulationRunLogStatus).map(
      (keyVal: [string, string]): string => {
        return keyVal[1];
      },
    ),
    required: true,
    default: undefined,
  })
  status!: SimulationRunLogStatus;

  @Prop({ type: ExceptionSchema, required: false, default: undefined })
  exception!: IException | null;

  @Prop({ type: ExceptionSchema, required: false, default: undefined })
  skipReason!: IException | null;

  @Prop({ type: String, required: false, default: undefined })
  output!: string | null;

  @Prop({ type: Number, required: false, default: undefined })
  duration!: number | null;
}
export const SedOutputLogSchema =
  SchemaFactory.createForClass(SedOutputLog);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class SimulatorDetail implements ISimulatorDetail {
  @Prop({ type: String, required: true, default: undefined })
  key!: string;

  @Prop({ type: Object, required: false, default: undefined })
  value!: any;
}
export const SimulatorDetailSchema =
  SchemaFactory.createForClass(SimulatorDetail);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class SedTaskLog implements ISedTaskLog {
  @Prop({ type: String, required: true, default: undefined })
  id!: string;

  @Prop({
    type: String,
    enum: Object.entries(SimulationRunLogStatus).map(
      (keyVal: [string, string]): string => {
        return keyVal[1];
      },
    ),
    required: true,
    default: undefined,
  })
  status!: SimulationRunLogStatus;

  @Prop({ type: ExceptionSchema, required: false, default: undefined })
  exception!: IException | null;

  @Prop({ type: ExceptionSchema, required: false, default: undefined })
  skipReason!: IException | null;

  @Prop({ type: String, required: false, default: undefined })
  output!: string | null;

  @Prop({ type: Number, required: false, default: undefined })
  duration!: number | null;

  @Prop({
    type: String,
    required: false,
    default: undefined,
    validate: [
      {
        validator: (value: any): boolean => {
          if (typeof value === 'string') {
            return value.match(KisaoIdRegEx) !== null && OntologiesService.isTermId(Ontologies.KISAO, value);
          } else {
            return value === null;
          }
        },
        message: (props: any): string =>
          `${props.value} is not an id of a KiSAO term`,
      },
    ],
  })
  algorithm!: string | null;

  @Prop({ type: [SimulatorDetailSchema], required: false, default: undefined })
  simulatorDetails!: ISimulatorDetail[] | null;
}
export const SedTaskLogSchema =
  SchemaFactory.createForClass(SedTaskLog);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class SedDocumentLog implements ISedDocumentLog {
  @Prop({ type: String, required: true, default: undefined })
  location!: string;

  @Prop({
    type: String,
    enum: Object.entries(SimulationRunLogStatus).map(
      (keyVal: [string, string]): string => {
        return keyVal[1];
      },
    ),
    required: true,
    default: undefined,
  })
  status!: SimulationRunLogStatus;

  @Prop({ type: ExceptionSchema, required: false, default: undefined })
  exception!: IException | null;

  @Prop({ type: ExceptionSchema, required: false, default: undefined })
  skipReason!: IException | null;

  @Prop({ type: String, required: false, default: undefined })
  output!: string | null;

  @Prop({ type: Number, required: false, default: undefined })
  duration!: number | null;

  @Prop({ type: [SedTaskLogSchema], required: false, default: undefined })
  tasks!: ISedTaskLog[] | null;

  @Prop({
    type: [SedOutputLogSchema],
    required: false,
    default: undefined,
  })
  outputs!: (SedReportLog | SedPlot2DLog | SedPlot3DLog)[] | null;
}
export const SedDocumentLogSchema =
  SchemaFactory.createForClass(SedDocumentLog);

const outputsArraySchema = SedDocumentLogSchema.path('outputs') as MongooseSchema.Types.DocumentArray;
outputsArraySchema.discriminator(SedReportLog.name, SedReportLogSchema);
outputsArraySchema.discriminator(SedPlot2DLog.name, SedPlot2DLogSchema);
outputsArraySchema.discriminator(SedPlot3DLog.name, SedPlot3DLogSchema);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class CombineArchiveLog implements ICombineArchiveLog {
  @Prop({
    type: String,
    enum: Object.entries(SimulationRunLogStatus).map(
      (keyVal: [string, string]): string => {
        return keyVal[1];
      },
    ),
    required: true,
    default: undefined,
  })
  status!: SimulationRunLogStatus;

  @Prop({ type: ExceptionSchema, required: false, default: undefined })
  exception!: IException | null;

  @Prop({ type: ExceptionSchema, required: false, default: undefined })
  skipReason!: IException | null;

  @Prop({ type: String, required: false, default: undefined })
  output!: string | null;

  @Prop({ type: Number, required: false, default: undefined })
  duration!: number | null;

  @Prop({ type: [SedDocumentLogSchema], required: false, default: undefined })
  sedDocuments!: ISedDocumentLog[] | null;
}
export const CombineArchiveLogSchema =
  SchemaFactory.createForClass(CombineArchiveLog);

@Schema({ collection: 'Simulation Run Logs', minimize: false })
export class SimulationRunLog extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: SimulationRunModel.name,
    validate: ObjectIdValidator,
    unique: true,
    index: true,
    required: true,
    default: undefined,
  })
  simId!: string;

  @Prop({ type: CombineArchiveLogSchema, required: true, default: undefined })
  log!: ICombineArchiveLog;

  @Prop()
  created!: Date;

  @Prop()
  updated!: Date;
}
export const SimulationRunLogSchema =
  SchemaFactory.createForClass(SimulationRunLog);
SimulationRunLogSchema.set('timestamps', {
  createdAt: 'created',
  updatedAt: 'updated',
});

SimulationRunLogSchema.set('strict', 'throw');
CombineArchiveLogSchema.set('strict', 'throw');
SedDocumentLogSchema.set('strict', 'throw');
SedTaskLogSchema.set('strict', 'throw');
SedOutputLogSchema.set('strict', 'throw');
SedReportLogSchema.set('strict', 'throw');
SedPlot2DLogSchema.set('strict', 'throw');
SedPlot3DLogSchema.set('strict', 'throw');
SimulatorDetailSchema.set('strict', 'throw');
SedOutputElementLogSchema.set('strict', 'throw');
ExceptionSchema.set('strict', 'throw');
// addValidationForNullableAttributes(SimulationRunLogSchema);
