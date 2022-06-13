import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StatisticDocument = Document & StatsItem;

@Schema({
  id: false,
  strict: 'throw',
  collection: 'Statistics',
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated',
  },
})
export class StatsItem {
  @Prop({
    index: true,
    unique: true,
    required: true,
    type: String,
  })
  public id!: string;

  @Prop()
  public labels: string[] = [];

  @Prop()
  public values: number[] = [];
}

export const StatItemSchema = SchemaFactory.createForClass(StatsItem);
