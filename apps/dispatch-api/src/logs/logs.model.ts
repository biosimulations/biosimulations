/**
 * @file The mongoose model for the a log object. Contains logging output and a pointer to the original simulation run
 * @author Bilal Shaikh
 * @copyright Biosimulations Team, 2021
 * @license MIT
 */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { CombineArchiveLog } from '@biosimulations/dispatch/api-models';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { ObjectIdValidator } from '@biosimulations/datamodel/common';
import { SimulationRunModel } from '../simulation-run/simulation-run.model';

@Schema({ collection: 'Simulation Run Logs', minimize: false })
export class SimulationRunLog extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: SimulationRunModel.name,
    validate: ObjectIdValidator,
    unique: true,
    index: true,
  })
  simId!: string;

  @Prop({ type: Object })
  log!: CombineArchiveLog;

  @Prop({ type: String, text: true })
  stdOut!: string;

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
