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
import {
  SimulationRun as ISimulationRun,
  SimulationRunStatus,
  Purpose,
  SimulationRunSummary as ISimulationRunSummary,
  SimulationRunTaskSummary as ISimulationRunTaskSummary,
  SimulationRunOutputSummary as ISimulationRunOutputSummary,
  SimulationRunRunSummary as ISimulationRunRunSummary,
  SimulationRunMetadataSummary as ISimulationRunMetadataSummary,
  SimulationRunModelSummary as ISimulationRunModelSummary,
  SimulationRunSimulationSummary as ISimulationRunSimulationSummary,
  SimulationRunModelLanguageSummary as ISimulationRunModelLanguageSummary,
  SimulationRunAlgorithmSummary as ISimulationRunAlgorithmSummary,
  SimulationRunSimulatorSummary as ISimulationRunSimulatorSummary,
  TypeSummary as ITypeSummary,
} from '@biosimulations/datamodel/common';
import {
  LabeledIdentifier,
  DescribedIdentifier,
  ABSTRACT,
  CITATIONS,
  CONTRIBUTORS,
  CREATED,
  CREATORS,
  DESCRIPTION,
  ENCODES,
  IDENTIFIERS,
  KEYWORDS,
  LICENCE,
  MODIFIED,
  PREDECESSORS,
  SEEALSO,
  SOURCES,
  SUCCESSORS,
  TAXA,
  TITLE,
  FUNDERS,
} from '../common';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsInt,
  IsPositive,
  Max,
  Matches,
  IsMongoId,
  ValidateNested,
  IsEnum,
  IsUrl,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class EnvironmentVariable {
  @ApiProperty({
    description: 'Name of the variable',
    type: String,
    example: 'VERBOSE',
  })
  @Matches(/^[a-zA-Z_][a-zA-Z_0-9]*$/)
  @IsString()
  key!: string;

  @ApiProperty({
    description: 'Value of the variable',
    type: String,
    example: '1',
  })
  @IsString()
  value!: string;
}

export class SimulationRun implements ISimulationRun {
  // Explicitly make sure not to send out file id from database
  file!: never;
  fileUrl!: never;

  @ApiResponseProperty({
    // description: 'Id of the simulation run',
    type: String,
    example: '5fab1cf714f9dd3dfbcfe51b',
  })
  @IsMongoId()
  id!: string;

  @ApiProperty({
    description: 'Name of the simulation run',
    type: String,
    example: 'Kockout of gene A',
  })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({
    type: String,
    description: 'The id of a BioSimulators simulator',
    example: 'tellurium',
    externalDocs: {
      url: 'https://biosimulators.org/simulators',
      description: 'Simulators List',
    },
  })
  @IsNotEmpty()
  @IsString()
  simulator!: string;

  @ApiProperty({
    description: 'Version of the simulation tool to execute the simulation',
    type: String,
    example: '2.2.0',
  })
  @IsNotEmpty()
  @IsString()
  simulatorVersion!: string;

  @ApiResponseProperty({
    // description: 'Digest of the simulation tool for the simulation run',
    type: String,
    // pattern: '^sha256:[a-z0-9]{64,64}$',
    example:
      'sha256:5d1595553608436a2a343f8ab7e650798ef5ba5dab007b9fe31cd342bf18ec81',
  })
  simulatorDigest!: string;

  // The optional properities cannot contain the '!' assertion since they are not garunteed!! Must be set in the constructor
  @ApiPropertyOptional({
    type: Number,
    description: 'Number of CPU cores needed to execute the simulation run',
    required: false,
    default: 1,
  })
  @IsOptional()
  @Max(24)
  @IsPositive()
  @IsInt()
  cpus: number;

  @ApiPropertyOptional({
    type: Number,
    description: 'Amount of RAM in GB needed to execute the simulation run',
    required: false,
    default: 8,
  })
  @IsOptional()
  @Max(192)
  @IsPositive()
  @IsInt()
  memory: number;

  @ApiPropertyOptional({
    type: Number,
    description: 'Time in minutes needed to execute the simulation run',
    required: false,
    default: 20,
  })
  @IsOptional()
  @Max(20 * 24 * 60)
  @IsPositive()
  @IsInt()
  maxTime: number;

  @ApiPropertyOptional({
    type: [EnvironmentVariable],
    description:
      'Key-value pairs of environment variables to execute the simulator with',
    required: false,
    default: [],
  })
  @IsOptional()
  @Type(() => EnvironmentVariable)
  @ValidateNested({ each: true })
  envVars: EnvironmentVariable[];

  @ApiPropertyOptional({
    type: String,
    enum: Purpose,
    description:
      'Whether use of commercial solvers is permitted because the purpose of the simulation is academic research or education',
    required: false,
    default: Purpose.other,
  })
  @IsOptional()
  @IsEnum(Purpose)
  purpose: Purpose;

  @ApiPropertyOptional({
    description:
      'Email to receive notification about completion of the simulation run',
    type: String,
    format: 'email',
    example: 'info@biosimulations.org',
    default: null,
  })
  @IsOptional()
  @IsEmail()
  email: string | null;

  @ApiPropertyOptional({
    description: 'Detail about the status of the simulation run',
    type: String,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  statusReason?: string;

  @ApiResponseProperty({
    // description: 'Status of the simulation run',
    type: String,
    enum: SimulationRunStatus,
  })
  status: SimulationRunStatus;

  @ApiResponseProperty({
    // description: 'Runtime of the simulation run in seconds',
    type: Number,
    example: 55,
  })
  runtime?: number;

  @ApiResponseProperty({
    // description: 'Size of the project (COMBINE/OMEX archive) for the simulation run',
    type: Number,
    example: 1123,
  })
  projectSize?: number;

  @ApiResponseProperty({
    // description: 'Size of the results (zip of reports and plots) for the simulation run',
    type: Number,
    example: 11234,
  })
  resultsSize?: number;

  @ApiResponseProperty({
    // description: 'Timestamp when the simulation run was submitted',
    type: String,
    format: 'date-time',
  })
  submitted!: Date;

  @ApiResponseProperty({
    // description: 'Timestamp when the status of the simulation run was last updated',
    type: String,
    format: 'date-time',
  })
  updated!: Date;

  constructor(
    id: string,
    name: string,
    simulator: string,
    simulatorVersion: string,
    simulatorDigest: string,
    cpus: number,
    memory: number,
    maxTime: number,
    envVars: EnvironmentVariable[],
    purpose: Purpose,
    submitted: Date,
    updated: Date,
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
    this.simulatorDigest = simulatorDigest;
    this.cpus = cpus || 1;
    this.memory = memory || 8;
    this.maxTime = maxTime || 20;
    this.envVars = envVars || [];
    this.purpose = purpose || Purpose.other;
    this.status = status || SimulationRunStatus.CREATED;
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
]) {
  @ApiPropertyOptional({
    type: String,
    description:
      'Unique id of the project that the run should be published to upon successful completion. If the project already exists, the existing run will be overwritten by the new run.',
    pattern: '^[a-zA-Z0-9_-]{3,}$',
  })
  @IsOptional()
  @Matches(/^[a-zA-Z0-9_-]{3,}$/, {
    message:
      "'projectId' must be a unique combination of at least three letters, numbers, underscores, and dashes",
  })
  @IsString()
  projectId?: string;
}

export class UploadSimulationRunUrl extends UploadSimulationRun {
  @ApiProperty({
    description: 'URL for the project (COMBINE/OMEX archive) to execute',
    type: String,
    format: 'url',
    example:
      // eslint-disable-next-line max-len
      'https://github.com/biosimulators/Biosimulators_test_suite/raw/dev/examples/sbml-core/Ciliberto-J-Cell-Biol-2003-morphogenesis-checkpoint-continuous.omex',
  })
  @IsUrl({
    require_protocol: true,
    protocols: ['http', 'https'],
  })
  url!: string;
}

export class SimulationUpload {
  @ApiProperty({
    description: 'Project (COMBINE/OMEX archive file) to execute',
    type: String,
    format: 'binary',
  })
  @IsNotEmpty()
  file!: string;

  @ApiProperty({
    description:
      'Details about how to execute the project (COMBINE/OMEX archive)',
    type: UploadSimulationRun,
  })
  @Type(() => UploadSimulationRun)
  @ValidateNested()
  simulationRun!: UploadSimulationRun;
}

export class PatchSimulationRun {
  @ApiPropertyOptional({
    description: 'Status of the simulation run',
    type: String,
    enum: SimulationRunStatus,
  })
  @IsOptional()
  @IsEnum(SimulationRunStatus)
  status?: SimulationRunStatus;

  @ApiPropertyOptional({
    description:
      'Size of the results (zip of reports and plots) for the simulation run',
    type: Number,
    example: 11234,
  })
  @IsOptional()
  @IsPositive()
  @IsInt()
  resultsSize?: number;

  @ApiPropertyOptional({
    description: 'Detail about the status of the simulation run',
    type: Number,
    example: 11234,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  statusReason?: string;
}

export class UpdateSimulationRun extends PartialType(PatchSimulationRun) {}

export class TypeSummary implements ITypeSummary {
  @ApiProperty({
    type: String,
    description: 'Id of the type',
    example: 'SedReport',
  })
  id!: string;

  @ApiProperty({
    type: String,
    description: 'Name of the type',
    example: 'SED-ML report',
  })
  name!: string;

  @ApiProperty({
    type: String,
    description: 'URL with more information about the type',
    example: 'http://sed-ml.org/',
  })
  url!: string;
}

export class SimulationRunModelLanguageSummary
  implements ISimulationRunModelLanguageSummary
{
  @ApiPropertyOptional({
    type: String,
    description: 'Name of the language',
    example: 'Systems Biology Markup Language',
  })
  name?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Acronym of the language',
    example: 'SBML',
  })
  acronym?: string;

  @ApiProperty({
    type: String,
    description:
      'SED-ML URN for the language. More information is available at http://sed-ml.org/urns.html.',
    example: 'urn:sedml:language:sbml',
  })
  sedmlUrn!: string;

  @ApiPropertyOptional({
    type: String,
    description:
      'EDAM id for the language. More information is available at https://www.ebi.ac.uk/ols/ontologies/edam.',
    example: 'format_2585',
  })
  edamId?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'URL with more information about the language',
    example:
      'https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_2585',
  })
  url?: string;
}

export class SimulationRunAlgorithmSummary
  implements ISimulationRunAlgorithmSummary
{
  @ApiProperty({
    type: String,
    description: 'KiSAO id of the algorithm',
    pattern: '^KISAO_\\d{7,7}$',
    example: 'KISAO_0000019',
  })
  kisaoId!: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Name of the algorithm',
    example: 'CVODE',
  })
  name?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'URL with more informationa about the algorithm',
    example:
      'https://www.ebi.ac.uk/ols/ontologies/kisao/terms?iri=http%3A%2F%2Fwww.biomodels.net%2Fkisao%2FKISAO%23KISAO_0000019',
  })
  url?: string;
}

export class SimulationRunModelSummary implements ISimulationRunModelSummary {
  @ApiProperty({
    type: String,
    description:
      'Id of the model (combination of the location of the parent file of the model within the archive and the id of the model)',
  })
  uri!: string;

  @ApiProperty({
    type: String,
    description: 'Id of the model',
  })
  id!: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Name of the model',
  })
  name?: string;

  @ApiProperty({
    type: String,
    description:
      'Location of the model relative to the location of its parent SED-ML file within its parent COMBINE/OMEX archive',
    example: './model.xml',
  })
  source!: string;

  @ApiProperty({
    type: SimulationRunModelLanguageSummary,
    description: 'Language of the model',
  })
  language!: SimulationRunModelLanguageSummary;
}

export class SimulationRunSimulationSummary
  implements ISimulationRunSimulationSummary
{
  @ApiProperty({
    type: TypeSummary,
    description: 'Type of the simulation',
  })
  type!: TypeSummary;

  @ApiProperty({
    type: String,
    description:
      'Id of the simulation (combination of the location of the parent file of the simulation within the archive and the id of the simulation)',
  })
  uri!: string;

  @ApiProperty({
    type: String,
    description: 'Id of the simulation',
  })
  id!: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Name of the simulation',
  })
  name?: string;

  @ApiProperty({
    type: SimulationRunAlgorithmSummary,
    description:
      'Algorithm that executed the simulation. Note, this differs from the algorithm stated in the specification of the simulation experiment when the specified simulation tool implements different algorithms.',
  })
  algorithm!: SimulationRunAlgorithmSummary;
}

export class SimulationRunTaskSummary implements ISimulationRunTaskSummary {
  @ApiProperty({
    type: String,
    description:
      'Id of the task (combination of the location of the parent file of the task within the archive and the id of the task)',
  })
  uri!: string;

  @ApiProperty({
    type: String,
    description: 'Id of the task',
  })
  id!: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Name of the task',
  })
  name?: string;

  @ApiProperty({
    type: SimulationRunModelSummary,
    description: 'Summary of the model for the task',
  })
  model!: SimulationRunModelSummary;

  @ApiProperty({
    type: SimulationRunSimulationSummary,
    description: 'Summary of the simulation for the task',
  })
  simulation!: SimulationRunSimulationSummary;
}

export class SimulationRunOutputSummary implements ISimulationRunOutputSummary {
  @ApiProperty({
    type: TypeSummary,
    description: 'Type of the output',
  })
  type!: TypeSummary;

  @ApiProperty({
    type: String,
    description:
      'Id of the plot (combination of the location of the parent file of the output within the archive and the id of the output)',
    example: 'figure1/simulation.sedml/figure1a',
  })
  uri!: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Name of the plot',
    example: 'Figure 1a',
  })
  name?: string;
}

export class SimulationRunSimulatorSummary
  implements ISimulationRunSimulatorSummary
{
  @ApiProperty({
    type: String,
    description:
      'BioSimulators id of the simulation tool which executed the simulation run',
    example: 'tellurium',
  })
  id!: string;

  @ApiProperty({
    description:
      'Name of the simulation tool which executed the simulation run',
    type: String,
    example: 'tellurium',
  })
  name!: string;

  @ApiProperty({
    description:
      'Version of the simulation tool which executed the simulation run',
    type: String,
    example: '2.2.1',
  })
  version!: string;

  @ApiProperty({
    description:
      'Digest of the simulation tool which executed the simulation run',
    type: String,
    pattern: '^sha256:[a-z0-9]{64,64}$',
    example:
      'sha256:5d1595553608436a2a343f8ab7e650798ef5ba5dab007b9fe31cd342bf18ec81',
  })
  digest!: string;

  @ApiProperty({
    description: 'URL with more information about the simulation tool',
    type: String,
    example: 'https://biosimulators.org/simulators/tellurium',
  })
  url!: string;
}

export class SimulationRunRunSummary implements ISimulationRunRunSummary {
  @ApiProperty({
    type: SimulationRunSimulatorSummary,
    description: 'Simulation tool which executed the simulation run',
    externalDocs: {
      url: 'https://biosimulators.org/simulators',
      description: 'Simulators list',
    },
  })
  simulator!: SimulationRunSimulatorSummary;

  @ApiProperty({
    type: Number,
    description: 'Number of CPU cores needed to execute the simulation run',
  })
  cpus!: number;

  @ApiProperty({
    type: Number,
    description: 'Amount of RAM in GB needed to execute the simulation run',
  })
  memory!: number;

  @ApiProperty({
    type: Number,
    description: 'Time in minutes needed to execute the simulation run',
  })
  maxTime!: number;

  @ApiProperty({
    type: [EnvironmentVariable],
    description:
      'Key-value pairs of environment variables to execute the simulator with',
  })
  envVars!: EnvironmentVariable[];

  @ApiProperty({
    description: 'Status of the simulation run',
    type: String,
    enum: SimulationRunStatus,
  })
  status!: SimulationRunStatus;

  @ApiProperty({
    description: 'Detail about the status of the simulation run',
    type: String,
  })
  statusReason?: string;

  @ApiProperty({
    description: 'Runtime of the simulation run in seconds',
    type: Number,
    example: 55,
  })
  runtime?: number;

  @ApiProperty({
    description:
      'Size of the project (COMBINE/OMEX archive) for the simulation run',
    type: Number,
    example: 1123,
  })
  projectSize?: number;

  @ApiProperty({
    description:
      'Size of the results (zip of reports and plots) for the simulation run',
    type: Number,
    example: 11234,
  })
  resultsSize?: number;
}

export class SimulationRunMetadataSummary
  implements ISimulationRunMetadataSummary
{
  @ApiPropertyOptional(TITLE)
  title?: string;

  @ApiPropertyOptional(ABSTRACT)
  abstract?: string;

  @ApiPropertyOptional(DESCRIPTION)
  description?: string;

  @ApiProperty({ type: [String] })
  thumbnails!: string[];

  @ApiProperty(SOURCES)
  sources!: LabeledIdentifier[];

  @ApiProperty(KEYWORDS)
  keywords!: LabeledIdentifier[];

  @ApiProperty(TAXA)
  taxa!: LabeledIdentifier[];

  @ApiProperty(ENCODES)
  encodes!: LabeledIdentifier[];

  @ApiProperty(PREDECESSORS)
  predecessors!: LabeledIdentifier[];

  @ApiProperty(SUCCESSORS)
  successors!: LabeledIdentifier[];

  @ApiProperty(SEEALSO)
  seeAlso!: LabeledIdentifier[];

  @ApiProperty(IDENTIFIERS)
  identifiers!: LabeledIdentifier[];

  @ApiProperty(CITATIONS)
  citations!: LabeledIdentifier[];

  @ApiProperty(CREATORS)
  creators!: LabeledIdentifier[];

  @ApiProperty(CONTRIBUTORS)
  contributors!: LabeledIdentifier[];

  @ApiPropertyOptional(LICENCE)
  license?: LabeledIdentifier[];

  @ApiProperty(FUNDERS)
  funders!: LabeledIdentifier[];

  @ApiProperty({ type: [DescribedIdentifier] })
  other!: DescribedIdentifier[];

  @ApiProperty(CREATED)
  created!: string;

  @ApiPropertyOptional(MODIFIED)
  modified?: string;
}

export class SimulationRunSummary implements ISimulationRunSummary {
  @ApiProperty({
    type: String,
    description: 'Id of the simulation run',
    example: '5fab1cf714f9dd3dfbcfe51b',
  })
  id!: string;

  @ApiProperty({
    description: 'Name of the simulation run',
    type: String,
    example: 'Kockout of gene A',
  })
  name!: string;

  @ApiPropertyOptional({
    type: [SimulationRunTaskSummary],
    description: 'Summary of the tasks of the run',
  })
  tasks?: SimulationRunTaskSummary[];

  @ApiPropertyOptional({
    type: [SimulationRunOutputSummary],
    description: 'Summary of the outputs of the run',
  })
  outputs?: SimulationRunOutputSummary[];

  @ApiProperty({
    type: SimulationRunRunSummary,
    description: 'Summary of the run',
  })
  run!: SimulationRunRunSummary;

  @ApiPropertyOptional({
    type: SimulationRunMetadataSummary,
    description: 'Summary of the metadata for the run',
  })
  metadata?: SimulationRunMetadataSummary;

  @ApiProperty({
    description: 'Timestamp when the simulation run was submitted',
    type: String,
    format: 'date-time',
  })
  submitted!: string;

  @ApiProperty({
    description:
      'Timestamp when the status of the simulation run was last updated',
    type: String,
    format: 'date-time',
  })
  updated!: string;
}
