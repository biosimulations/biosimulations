/**
 * @file The mongoose model for the a resuls object. Contains results metadata and a pointer to the results file(s)
 * @author Bilal Shaikh
 * @copyright Biosimulations Team, 2020
 * @license MIT
 */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ id: false })
export class ResultsModel extends Document {
  @Prop({ index: true, unique: true })
  id!: string;
}

export const ResultsSchema = SchemaFactory.createForClass(ResultsModel);
