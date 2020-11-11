import {
  ApiProperty,
  ApiPropertyOptional,
  ApiResponse,
  ApiResponseProperty,
  PartialType,
} from '@nestjs/swagger';
import { SimulationRunStatus } from './simulation-run.model';

export class SimulationRun {
  @ApiResponseProperty({ example: '5fab1cf714f9dd3dfbcfe51b' })
  id!: string;

  @ApiProperty({ example: 'Kockout of gene A' })
  name!: string;

  @ApiProperty({
    description: 'The name of a BioSimulators compliant simulator',
    examples: [
      'vcell',
      'gillespy2',
      'cobrapy',
      'copasi',
      'bionetgen',
      'tellurium',
    ],
    example: 'tellurium',
    externalDocs: {
      url: 'https://biosimulators.org/simulators',
      description: 'Simulators List',
    },
  })
  simulator!: string;

  @ApiProperty({ examples: ['latest', '2.1'], example: 'latest' })
  simulatorVersion!: string;

  @ApiPropertyOptional({ format: 'email', example: 'info@biosimulations.org' })
  email!: string;

  @ApiProperty({ type: Boolean, default: false })
  public!: boolean;
  @ApiResponseProperty({ example: '5fab1cf714f9dd3dfbcfe51b' })
  file!: string;
  @ApiResponseProperty({ enum: SimulationRunStatus })
  status!: SimulationRunStatus;

  @ApiResponseProperty({ example: 55 })
  duration!: number;

  @ApiResponseProperty({ example: 1123 })
  projectSize!: number;

  @ApiResponseProperty({ example: 11234 })
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
export class PatchSimulationRun {
  @ApiProperty({ type: Boolean })
  public!: boolean;

  @ApiProperty({ enum: SimulationRunStatus })
  status!: SimulationRunStatus;

  @ApiProperty({ example: 55 })
  duration!: number;

  @ApiProperty({ example: 1123 })
  projectSize!: number;

  @ApiProperty({ example: 11234 })
  resultsSize!: number;
}

export class UpdateSimulationRun extends PartialType(PatchSimulationRun) {}
