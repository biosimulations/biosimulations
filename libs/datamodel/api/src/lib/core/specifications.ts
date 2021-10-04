import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

export class SimulationRunSpecifications {
  @ApiProperty()
  public id!: string;
  @ApiProperty()
  public simulationRun!: string;
  @ApiProperty()
  public models!: any[];
  @ApiProperty()
  public simulations!: any[];
  @ApiProperty()
  public dataGenerators!: any[];
  @ApiProperty()
  public outputs!: any[];
  @ApiProperty()
  public tasks!: any[];
  @ApiResponseProperty()
  public created!: string;
  @ApiResponseProperty()
  public updated!: string;
}
