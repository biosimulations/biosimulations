/**
 * @file Contains the mongoose model definition for a Simulation Run. The omex file is stored as a ObjectId refrence to the file also stored in the database.
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
    enum: Object.keys(SimulationRunStatus).map((key) => SimulationRunStatus[key as SimulationRunStatus]),

    default: SimulationRunStatus.CREATED,
  })
  status!: SimulationRunStatus;

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
  | 'refreshCount'
  | 'submitted'
  | 'updated'
  | 'public'
  | '__v'
  | '_id'
>;
export type TestType = Exclude<SimulationRunModel, Document>;
export type SimulationRunModelReturnType = Omit<SimulationRunModelType, '__v' | '_id' | 'file'> & { _id: never; __v: never };
export const SimulationRunModelSchema = SchemaFactory.createForClass(SimulationRunModel);
SimulationRunModelSchema.set('timestamps', {
  createdAt: 'submitted',
  updatedAt: 'updated',
});
SimulationRunModelSchema.set('toObject', { transform: omitPrivate });
SimulationRunModelSchema.set('toJSON', { transform: omitPrivate });
