import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

export class SimulationRunSpecifications {
  @ApiProperty({type: String})
  public id!: string;

  @ApiProperty({type: String})
  public simulationRun!: string;

  @ApiProperty({type: [Object]})
  public models!: any[];

  @ApiProperty({type: [Object]})
  public simulations!: any[];

  @ApiProperty({type: [Object]})
  public dataGenerators!: any[];

  @ApiProperty({type: [Object]})
  public outputs!: any[];

  @ApiProperty({type: [Object]})
  public tasks!: any[];

  @ApiResponseProperty({
    type: String,
    format: 'date-time',
    // description: 'Timestamp when the specifications were created',
  })
  public created!: string;

  @ApiResponseProperty({
    type: String,
    format: 'date-time',
    // description: 'Timestamp when the specifications were last updated',
  })
  public updated!: string;
}
