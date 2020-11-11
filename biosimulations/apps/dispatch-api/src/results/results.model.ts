import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ id: false })
export class ResultsModel extends Document {
  @Prop({ index: true, unique: true })
  id!: string;
}

export const ResultsSchema = SchemaFactory.createForClass(ResultsModel);
