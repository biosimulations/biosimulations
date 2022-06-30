import { MessageEvent } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export type SimulationRunEventType = 'status' | 'log';
export class SimulationRunEvent implements MessageEvent {
  public type!: SimulationRunEventType;
  public data!: any;
}

export class StatusUpdatedEventData {
  @ApiProperty({
    description: 'The status of the simulation run',
    example: 'running',
  })
  public status!: string;

  @ApiProperty()
  public id!: string;
}

export class StatusUpdatedEvent implements MessageEvent {
  @ApiProperty({
    enum: ['status'],
  })
  public type!: 'status';
  @ApiProperty({
    type: StatusUpdatedEventData,
  })
  public data!: StatusUpdatedEventData;
}
