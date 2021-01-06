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
  SimulationRunResults
} from '@biosimulations/dispatch/api-models';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, isValidObjectId, Types } from 'mongoose';

// No idea why this wrapper is needed, but providing isValidObjectId directly below fails
// TODO move to utils
const ObjectIdValidator = (id: any): boolean => {
  return isValidObjectId(id);
};

@Schema({ collection: 'Results' })
export class ResultsModel extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: SimulationRun.name,
    validate: ObjectIdValidator
  })
  simId!: string;

  @Prop()
  reportId!: string;

  @Prop({ type: Object })
  data!: SimulationRunReportData;

  @Prop()
  created!: Date;

  @Prop()
  updated!: Date;
}

export const ResultsSchema = SchemaFactory.createForClass(ResultsModel);
ResultsSchema.set('timestamps', {
  createdAt: 'created',
  updatedAt: 'updated'
});
ResultsSchema.index({ simId: 1, reportId: 1 }, { unique: true });
ResultsSchema.set('toObject', { transform: omitPrivate });
ResultsSchema.set('toJSON', { transform: omitPrivate });
