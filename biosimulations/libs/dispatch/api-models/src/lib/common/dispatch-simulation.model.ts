import { prop } from '@typegoose/typegoose';
import { ApiProperty } from '@nestjs/swagger';

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
  @ApiProperty()
  @prop({ required: true })
  uuid!: string;

  @ApiProperty()
  @prop({ required: false })
  authorEmail!: string;

  @ApiProperty()
  @prop({ required: true })
  nameOfSimulation!: string;

  @ApiProperty()
  @prop()
  submittedTime!: Date;

  @ApiProperty()
  @prop()
  statusModifiedTime!: Date;

  @ApiProperty()
  @prop()
  currentStatus!: SimulationStatus;

  @ApiProperty()
  @prop()
  duration!: number;

  constructor(public model: DispatchSimulationModel) {
    this.uuid = model.uuid;
    this.authorEmail = model.authorEmail;
    this.nameOfSimulation = model.nameOfSimulation;
    this.submittedTime = model.submittedTime;
    this.statusModifiedTime = model.statusModifiedTime;
    this.currentStatus = model.currentStatus;
    this.duration = model.duration;
  }
}
