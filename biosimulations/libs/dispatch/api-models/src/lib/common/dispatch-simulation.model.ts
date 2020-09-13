import { prop } from '@typegoose/typegoose';

export interface DispatchSimulationModel {
  uuid: string;
  authorEmail: string;
  nameOfSimulation: string;
  submittedTime: Date;
  statusModifiedTime: Date;
  currentStatus: SimulationStatus;
  duration: number;
}

enum SimulationStatus {
  QUEUED = 'QUEUED',
  RUNNING = 'RUNNING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
}

export class DispatchSimulationModelDB implements DispatchSimulationModel {
  @prop({ required: true })
  uuid!: string;

  @prop({ required: false })
  authorEmail!: string;

  @prop({ required: true })
  nameOfSimulation!: string;

  @prop()
  submittedTime!: Date;

  @prop()
  statusModifiedTime!: Date;

  @prop()
  currentStatus!: SimulationStatus;

  @prop()
  duration!: number;
}
