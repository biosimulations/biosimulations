/**
 * @file Contains the mongoose model definition for a simulation run. The COMBINE/OMEX archive file is stored as a ObjectId refrence to the file also stored in the database.
 * @author Bilal Shaikh
 * @copyright Biosimulations Team, 2020
 * @license MIT
 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';
import { SimulationFile } from './file.model';
import { SimulationRunStatus } from '@biosimulations/datamodel/common';
import { omitPrivate } from '@biosimulations/datamodel/common';
import { isEmail, isUrl } from '@biosimulations/datamodel-database';

@Schema({ collection: 'Simulation Runs', id: false })
export class SimulationRunModel extends Document {
  @Prop({ required: true, unique: true, index: true })
  id!: string;

  @Prop({ type: Types.ObjectId, ref: SimulationFile.name })
  file!: SimulationFile;

  @Prop({
    type: String,
    required: false,
    validate: [isUrl],
  })
  fileUrl?: string;

  @Prop({ type: String, required: true })
  name!: string;

  @Prop({
    type: String,
    required: false,
    default: null,
    validate: [isEmail],
  })
  email!: string | null;

  @Prop({
    type: String,
    enum: Object.keys(SimulationRunStatus).map(
      (key) => SimulationRunStatus[key as SimulationRunStatus],
    ),

    default: SimulationRunStatus.CREATED,
  })
  status!: SimulationRunStatus;

  @Prop({
    type: String,
    required: false,
  })
  statusReason: string | undefined;

  @Prop()
  runtime!: number;

  @Prop()
  projectSize?: number;

  @Prop()
  resultsSize!: number;

  @Prop({ type: String, required: true })
  simulator!: string;

  @Prop({ type: String, required: true })
  simulatorVersion!: string;

  @Prop({
    type: Number,
    required: false,
    default: 1,
    validate: [
      {
        validator: (value: any): boolean => {
          return (
            !isNaN(value) &&
            value >= 1 &&
            value <= 24 &&
            value == Math.floor(value)
          );
        },
        message: (props: any): string =>
          'Number of requested CPUs must be a positive integer less than or equal to 24.',
      },
    ],
  })
  cpus!: number;

  @Prop({
    type: Number,
    required: false,
    default: 8,
    validate: [
      {
        validator: (value: any): boolean => {
          return (
            !isNaN(value) &&
            value > 0 &&
            value <= 192 &&
            value == Math.floor(value)
          );
        },
        message: (props: any): string =>
          'Amount of requested RAM (in GB) must be a positive float less than or equal to 192.',
      },
    ],
  })
  memory!: number;

  @Prop({
    type: Number,
    required: false,
    default: 20,
    validate: [
      {
        validator: (value: any): boolean => {
          return (
            !isNaN(value) &&
            value > 0 &&
            value <= 20 * 24 * 60 &&
            value == Math.floor(value)
          );
        },
        message: (props: any): string =>
          'Amount of requested time (in min) must be a positive float less than or equal to 28800 (20 days).',
      },
    ],
  })
  maxTime!: number;

  @Prop()
  submitted!: Date;

  @Prop()
  updated!: Date;

  @Prop({ type: Boolean, default: false })
  public!: boolean;

  @Prop({ type: Number, default: 0 })
  refreshCount!: number;
}

export type SimulationRunModelType = Pick<
  SimulationRunModel,
  | 'id'
  | 'name'
  | 'email'
  | 'status'
  | 'runtime'
  | 'projectSize'
  | 'resultsSize'
  | 'simulator'
  | 'simulatorVersion'
  | 'cpus'
  | 'memory'
  | 'maxTime'
  | 'refreshCount'
  | 'submitted'
  | 'updated'
  | 'public'
  | '__v'
  | '_id'
>;
export type TestType = Exclude<SimulationRunModel, Document>;
export type SimulationRunModelReturnType = Omit<
  SimulationRunModelType,
  '__v' | '_id' | 'file'
> & { _id: never; __v: never };
export const SimulationRunModelSchema =
  SchemaFactory.createForClass(SimulationRunModel);
SimulationRunModelSchema.set('timestamps', {
  createdAt: 'submitted',
  updatedAt: 'updated',
});
SimulationRunModelSchema.set('toObject', { transform: omitPrivate });
SimulationRunModelSchema.set('toJSON', { transform: omitPrivate });
