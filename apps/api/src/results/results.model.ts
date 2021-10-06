/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/**
 * @file The mongoose model for the a resuls object. Contains results metadata and a pointer to the results file(s)
 * @author Bilal Shaikh
 * @copyright Biosimulations Team, 2020
 * @license MIT
 */
import {
  omitPrivate,
  ObjectIdValidator,
} from '@biosimulations/datamodel-database';

import { SimulationRun } from '@biosimulations/datamodel/api';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ResultsData =
  | { [key: string]: Array<number> }
  | { [key: string]: Array<boolean> };
@Schema({ collection: 'Results' })
export class ResultsModel extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: SimulationRun.name,
    validate: ObjectIdValidator,
  })
  simId!: string;

  @Prop()
  reportId!: string;

  @Prop({ type: Object })
  data!: ResultsData;

  @Prop()
  created!: Date;

  @Prop()
  updated!: Date;
}

export const ResultsSchema = SchemaFactory.createForClass(ResultsModel);
ResultsSchema.set('timestamps', {
  createdAt: 'created',
  updatedAt: 'updated',
});
ResultsSchema.index({ simId: 1, reportId: 1 }, { unique: true });
ResultsSchema.set('toObject', { transform: omitPrivate });
ResultsSchema.set('toJSON', { transform: omitPrivate });
