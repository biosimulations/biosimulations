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
  // UNKNOWN = 'UNKNOWN',
  CANCELLED = 'CANCELLED',
  TIMEOUT = 'TIMEOUT',
  OUT_OF_MEMORY = 'OUT-OF-MEMORY',
  NODE_FAIL = 'NODE_FAIL',
}

@modelOptions({ schemaOptions: { collection: 'dispatches' } })
export class DispatchSimulationModelDB implements DispatchSimulationModel {
  @ApiProperty({ type: String })
  @prop({ type: String, required: true })
  uuid!: string;

  @ApiProperty({ type: String })
  @prop({ type: String, required: false })
  authorEmail!: string;

  @ApiProperty({ type: String })
  @prop({ type: String })
  nameOfSimulation!: string;

  @ApiProperty({ type: String, format: 'date-time' })
  @prop()
  submittedTime!: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  @prop()
  statusModifiedTime!: Date;

  @ApiProperty({ type: String, enum: DispatchSimulationStatus })
  @prop({
    type: String, 
    enum: Object.entries(DispatchSimulationStatus).map((keyVal: [string, string]): string => {
      return keyVal[1];
    }),
  })
  currentStatus!: DispatchSimulationStatus;

  @ApiProperty({ type: Number })
  @prop({ type: Number })
  duration!: number;

  @prop({ type: Number })
  projectSize!: number;

  @prop({ type: Number })
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
