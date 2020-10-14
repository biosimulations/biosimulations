import { modelOptions, prop } from '@typegoose/typegoose';
import { ApiProperty } from '@nestjs/swagger';

export interface DispatchSimulationModel {
  uuid: string;
  authorEmail: string;
  nameOfSimulation: string;
  submittedTime: Date;
  statusModifiedTime: Date;
  currentStatus: DispatchSimulationStatus;
  duration: number;
  resultSize: number;
  projectSize: number
}

export enum DispatchSimulationStatus {
  QUEUED = 'QUEUED',
  RUNNING = 'RUNNING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  UNKNOWN = 'UNKNOWN',
}

@modelOptions({ schemaOptions: { collection: 'dispatches' } })
export class DispatchSimulationModelDB implements DispatchSimulationModel {
  @ApiProperty()
  @prop({ required: true })
  uuid!: string;

  @ApiProperty()
  @prop({ required: false })
  authorEmail!: string;

  @ApiProperty()
  @prop()
  nameOfSimulation!: string;

  @ApiProperty()
  @prop()
  submittedTime!: Date;

  @ApiProperty()
  @prop()
  statusModifiedTime!: Date;

  @ApiProperty()
  @prop()
  currentStatus!: DispatchSimulationStatus;

  @ApiProperty()
  @prop()
  duration!: number;

  @prop()
  projectSize!: number;

  @prop()
  resultSize!: number;

  constructor(public model: DispatchSimulationModel) {
    this.uuid = model.uuid;
    this.authorEmail = model.authorEmail;
    this.nameOfSimulation = model.nameOfSimulation;
    this.submittedTime = model.submittedTime;
    this.statusModifiedTime = model.statusModifiedTime;
    this.currentStatus = model.currentStatus;
    this.duration = model.duration;
    this.resultSize = model.resultSize;
    this.projectSize = model.projectSize;
  }
}
