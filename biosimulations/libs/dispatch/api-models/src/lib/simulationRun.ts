/**
 * @file Contains the DTO specification for the simulation run object, as well as the multipart/form-data request for uploading a new simulation
 * @author Bilal Shaikh
 * @copyright Biosimulations Team, 2020
 * @license MIT
 */
import {
  ApiProperty,
  ApiPropertyOptional,
  ApiResponse,
  ApiResponseProperty,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { SimulationRunStatus } from '@biosimulations/datamodel/common';

export class SimulationRun {
  // Explicitly make sure not to send out file id from database
  file: never;
  @ApiResponseProperty({ type: String, example: '5fab1cf714f9dd3dfbcfe51b' })
  id!: string;

  @ApiProperty({ type: String, example: 'Kockout of gene A' })
  name!: string;

  @ApiProperty({
    type: String,
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

  @ApiProperty({ type: String, examples: ['latest', '2.1'], example: 'latest' })
  simulatorVersion!: string;

  @ApiPropertyOptional({
    type: String,
    format: 'email',
    example: 'info@biosimulations.org',
  })
  email!: string | null;

  @ApiProperty({ type: Boolean, default: false })
  public: boolean;

  @ApiResponseProperty({ type: String, enum: SimulationRunStatus })
  status: SimulationRunStatus;

  @ApiResponseProperty({ type: Number, example: 55 })
  runtime?: number;

  @ApiResponseProperty({ type: Number, example: 1123 })
  projectSize?: number;

  @ApiResponseProperty({ type: Number, example: 11234 })
  resultsSize?: number;

  @ApiResponseProperty({ type: String, format: 'date-time' })
  submitted!: Date;

  @ApiResponseProperty({ type: String, format: 'date-time' })
  updated!: Date;

  constructor(
    id: string,
    name: string,
    simulator: string,
    simulatorVersion: string,
    status: SimulationRunStatus,
    isPublic: boolean,
    submitted: Date,
    updated: Date,
    runtime?: number,
    projectSize?: number,
    resultsSize?: number,
    email?: string | null,
  ) {
    this.id = id;
    this.name = name;
    this.simulator = simulator;
    this.simulatorVersion = simulatorVersion;
    this.status = status;
    this.public = isPublic;
    this.submitted = submitted;
    this.updated = updated;
    this.projectSize = projectSize;
    this.resultsSize = resultsSize;

    this.runtime = runtime;
    this.email = email || null;
  }
}
export class UploadSimulationRun extends PickType(SimulationRun, [
  'name',
  'email',
  'simulator',
  'simulatorVersion',
]) {}
export class UploadSimulationRunUrl extends UploadSimulationRun {
  @ApiProperty({ type: String, format: 'url' })
  url!: string;
}

export class SimulationUpload {
  @ApiProperty({ type: String, format: 'binary' })
  file!: string;

  @ApiProperty({ type: SimulationRun })
  simulationRun!: UploadSimulationRun;
}

export class PatchSimulationRun {
  @ApiPropertyOptional({ type: Boolean })
  public?: boolean;

  @ApiPropertyOptional({ type: String, enum: SimulationRunStatus })
  status?: SimulationRunStatus;

  @ApiPropertyOptional({ type: Number, example: 11234 })
  resultsSize?: number;
}

export class UpdateSimulationRun extends PartialType(PatchSimulationRun) {}
