import {
  ApiProperty,
  ApiPropertyOptional,
  ApiResponse,
  ApiResponseProperty,
} from '@nestjs/swagger';
import { SimulationRunStatus } from './simulation-run.model';

export class SimulationRun {
  @ApiResponseProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  simulator!: string;

  @ApiProperty()
  simulatorVersion!: string;

  @ApiPropertyOptional()
  email!: string;

  @ApiProperty({ type: Boolean, default: false })
  public!: boolean;

  @ApiResponseProperty({ enum: SimulationRunStatus })
  status!: SimulationRunStatus;

  @ApiResponseProperty()
  duration!: number;

  @ApiResponseProperty()
  projectSize!: number;

  @ApiResponseProperty()
  resultsSize!: number;

  @ApiResponseProperty()
  submitted!: Date;

  @ApiResponseProperty()
  updated!: Date;
}
export class SimulationUpload {
  @ApiProperty({ type: String, format: 'binary' })
  file!: string;
  @ApiProperty({ type: SimulationRun })
  simulationRun!: SimulationRun;
}
