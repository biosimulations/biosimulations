/**
 * @file The mongoose model for the a resuls object. Contains results metadata and a pointer to the results file(s)
 * @author Bilal Shaikh
 * @copyright Biosimulations Team, 2020
 * @license MIT
 */
import { omitPrivate } from '@biosimulations/datamodel/common';
import {
  SimulationRun,
  SimulationRunReportData,
} from '@biosimulations/dispatch/api-models';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ id: true })
export class ResultsModel extends Document {
  @Prop({ type: Types.ObjectId, ref: SimulationRun.name })
  simId!: SimulationRun;

  @Prop()
  reportId!: string;

  @Prop()
  data!: SimulationRunReportData;
}

export const ResultsSchema = SchemaFactory.createForClass(ResultsModel);
ResultsSchema.index({ simId: 1, reportId: 1 }, { unique: true });
ResultsSchema.set('toObject', { transform: omitPrivate });
ResultsSchema.set('toJSON', { transform: omitPrivate });
