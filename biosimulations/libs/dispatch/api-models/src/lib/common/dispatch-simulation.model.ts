import { modelOptions, prop } from '@typegoose/typegoose';
import { ApiProperty } from '@nestjs/swagger';

export interface DispatchSimulationModel {
  uuid: string;
  email: string;
  name: string;
  submitted: Date;
  updated: Date;
  status: DispatchSimulationStatus;
  runtime: number;
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
  email!: string;

  @ApiProperty({ type: String })
  @prop({ type: String })
  name!: string;

  @ApiProperty({ type: String, format: 'date-time' })
  @prop()
  submitted!: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  @prop()
  updated!: Date;

  @ApiProperty({ type: String, enum: DispatchSimulationStatus })
  @prop({
    type: String, 
    enum: Object.entries(DispatchSimulationStatus).map((keyVal: [string, string]): string => {
      return keyVal[1];
    }),
  })
  status!: DispatchSimulationStatus;

  @ApiProperty({ type: Number })
  @prop({ type: Number })
  runtime!: number;

  @prop({ type: Number })
  projectSize!: number;

  @prop({ type: Number })
  resultSize!: number;

  constructor(public model: DispatchSimulationModel) {
    this.uuid = model.uuid;
    this.email = model.email;
    this.name = model.name;
    this.submitted = model.submitted;
    this.updated = model.updated;
    this.status = model.status;
    this.runtime = model.runtime;
    this.resultSize = model.resultSize;
    this.projectSize = model.projectSize;
  }
}
