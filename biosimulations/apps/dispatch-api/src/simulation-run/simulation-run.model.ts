/**
 * @file Contains the mongoose model definition for a Simulation Run. The omex file is stored as a ObjectId refrence to the file also stored in the database.
 * @author Bilal Shaikh
 * @copyright Biosimulations Team, 2020
 * @license MIT
 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';
import * as EmailValidator from 'email-validator';
import { SimulationFile, SimulationFileSchema } from './file.model';

// TODO move this to common utils
const omitPrivate = (doc: any, obj: any) => {
  delete obj.__v;
  delete obj._id;

  return obj;
};

// TODO combine with already defined enum
export enum SimulationRunStatus {
  // The api has created the entry
  CREATED = 'CREATED',
  // The api has submitted the run and service has accepted
  QUEUED = 'QUEUED',
  // The service has starting the run
  RUNNING = 'RUNNING',
  // The run has finished
  SUCCEEDED = 'SUCCEEDED',
  // The run has failed
  FAILED = 'FAILED',
}

@Schema({ collection: 'Simulation Runs', id: false })
export class SimulationRunModel extends Document {
  @Prop({ required: true, unique: true, index: true })
  id!: string;

  @Prop({ type: Types.ObjectId, ref: SimulationFile.name })
  file!: SimulationFile;
  @Prop({ type: String, required: true })
  name!: string;

  @Prop({ type: String, required: false, validate: EmailValidator.validate })
  email!: string;

  @Prop({
    type: String,
    enum: Object.keys(SimulationRunStatus).map(
      (key) => SimulationRunStatus[key as SimulationRunStatus]
    ),

    default: SimulationRunStatus.CREATED,
  })
  status!: SimulationRunStatus;

  @Prop()
  duration!: number;

  @Prop()
  projectSize!: number;

  @Prop()
  resultsSize!: number;

  @Prop({ type: String, required: true })
  simulator!: string;

  @Prop({ type: String, required: true })
  simulatorVersion!: string;

  @Prop()
  submitted!: Date;

  @Prop()
  updated!: Date;

  @Prop({ type: Boolean, default: false })
  public!: boolean;
}

export const SimulationRunModelSchema = SchemaFactory.createForClass(
  SimulationRunModel
);
SimulationRunModelSchema.set('timestamps', {
  createdAt: 'submitted',
  updatedAt: 'updated',
});
SimulationRunModelSchema.set('toObject', { transform: omitPrivate });
SimulationRunModelSchema.set('toJSON', { transform: omitPrivate });
