/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/**
 * @file Contains the DTO specification for the simulation run object,
 *       as well as the multipart/form-data request for uploading a new simulation
 * @author Bilal Shaikh
 * @copyright Biosimulations Team, 2020
 * @license MIT
 */
import {
  ApiProperty,
  ApiPropertyOptional,
  ApiResponseProperty,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { SimulationRunStatus, Purpose } from '@biosimulations/datamodel/common';

export class EnvironmentVariable {
  @ApiProperty({ type: String, example: 'VERBOSE' })
  key!: string;

  @ApiProperty({ type: String, example: '1' })
  value!: string;
}

export class SimulationRun {
  // Explicitly make sure not to send out file id from database
  file: never;
  fileUrl: never;

  @ApiResponseProperty({ type: String, example: '5fab1cf714f9dd3dfbcfe51b' })
  id!: string;

  @ApiProperty({ type: String, example: 'Kockout of gene A' })
  name!: string;

  @ApiProperty({
    type: String,
    description: 'The name of a BioSimulators compliant simulator',
    example: 'tellurium',
    externalDocs: {
      url: 'https://biosimulators.org/simulators',
      description: 'Simulators List',
    },
  })
  simulator!: string;

  @ApiProperty({ type: String, example: '2.2.0' })
  simulatorVersion!: string;

  // The optional properities cannot contain the '!' assertion since they are not garunteed!! Must be set in the constructor
  @ApiPropertyOptional({
    type: Number,
    description: 'Number of CPU cores needed to execute the simulation project',
    required: false,
    default: 1,
  })
  cpus: number;

  @ApiPropertyOptional({
    type: Number,
    description: 'Amount of RAM in GB needed to execute the simulation project',
    required: false,
    default: 8,
  })
  memory: number;

  @ApiPropertyOptional({
    type: Number,
    description: 'Time in minutes needed to execute the simulation project',
    required: false,
    default: 20,
  })
  maxTime: number;

  @ApiPropertyOptional({
    type: [EnvironmentVariable],
    description:
      'Key-value pairs of environment variables to execute the simulator with',
    required: false,
    default: [],
  })
  envVars: EnvironmentVariable[];

  @ApiPropertyOptional({
    type: String,
    enum: Purpose,
    description: 'Whether use of commercial solvers is permitted because the purpose of the simulation is academic research or education',
    required: false,
    default: Purpose.other,
  })
  purpose: Purpose;

  @ApiPropertyOptional({
    type: String,
    format: 'email',
    example: 'info@biosimulations.org',
  })
  email: string | null;

  @ApiProperty({ type: Boolean, default: false })
  public: boolean;

  @ApiPropertyOptional({ type: String })
  statusReason?: string;

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
    cpus: number,
    memory: number,
    maxTime: number,
    envVars: EnvironmentVariable[],
    purpose: Purpose,
    submitted: Date,
    updated: Date,
    isPublic?: boolean,
    status?: SimulationRunStatus,
    runtime?: number,
    projectSize?: number,
    resultsSize?: number,
    email?: string | null,
    statusReason?: string,
  ) {
    this.id = id;
    this.name = name;
    this.simulator = simulator;
    this.simulatorVersion = simulatorVersion;
    this.cpus = cpus || 1;
    this.memory = memory || 8;
    this.maxTime = maxTime || 20;
    this.envVars = envVars || [];
    this.purpose = purpose || Purpose.other;
    this.status = status || SimulationRunStatus.CREATED;
    this.public = isPublic || false;
    this.submitted = submitted;
    this.updated = updated;
    this.projectSize = projectSize;
    this.resultsSize = resultsSize;
    this.statusReason = statusReason;

    this.runtime = runtime;
    this.email = email || null;
  }
}

export class UploadSimulationRun extends PickType(SimulationRun, [
  'name',
  'email',
  'simulator',
  'simulatorVersion',
  'cpus',
  'memory',
  'maxTime',
  'envVars',
  'purpose',
  'public',
]) {}

export class UploadSimulationRunUrl extends UploadSimulationRun {
  @ApiProperty({
    type: String,
    format: 'url',
    example:
      // eslint-disable-next-line max-len
      'https://github.com/biosimulators/Biosimulators_test_suite/raw/dev/examples/sbml-core/Ciliberto-J-Cell-Biol-2003-morphogenesis-checkpoint-continuous.omex',
  })
  url!: string;
}

export class SimulationUpload {
  @ApiProperty({ type: String, format: 'binary' })
  file!: string;

  @ApiProperty({ type: UploadSimulationRun })
  simulationRun!: UploadSimulationRun;
}

export class PatchSimulationRun {
  @ApiPropertyOptional({ type: Boolean })
  public?: boolean;

  @ApiPropertyOptional({ type: String, enum: SimulationRunStatus })
  status?: SimulationRunStatus;

  @ApiPropertyOptional({ type: Number, example: 11234 })
  resultsSize?: number;

  @ApiPropertyOptional({ type: Number, example: 11234 })
  statusReason?: string;
}

export class UpdateSimulationRun extends PartialType(PatchSimulationRun) {}
