import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum SimulationRunStatus {
  QUEUED = 'QUEUED',
  RUNNING = 'RUNNING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
}

@Schema({ collection: 'Simulation Runs' })
export class SimulationRunModel extends Document {
  @Prop({ index: true })
  id!: string;

  @Prop()
  name!: string;

  @Prop()
  email!: string;

  @Prop()
  status!: SimulationRunStatus;

  @Prop()
  duration!: number;

  @Prop()
  projectSize!: number;

  @Prop()
  resultsSize!: number;

  @Prop()
  simulator!: string;

  @Prop()
  simulationVersion!: string;

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
