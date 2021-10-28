import { ApiProperty, ApiPropertyOptional, ApiResponseProperty, ApiExtraModels, OmitType } from '@nestjs/swagger';
import { 
  Project as IProject, 
  ProjectInput as IProjectInput,
  SimulationTaskSummary as ISimulationTaskSummary,
  ModelSummary as IModelSummary,
  SimulationSummary as ISimulationSummary,
  SimulationOutputSummary as ISimulationOutputSummary,
  SimulationOutputType,
  SimulationRunSummary as ISimulationRunSummary,
  ProjectMetadataSummary as IProjectMetadataSummary,
  ProjectSummary as IProjectSummary,
  SimulationType,
} from '@biosimulations/datamodel/common';
import { IsNotEmpty, IsString, Matches, IsMongoId } from 'class-validator';
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
  EnvironmentVariable
} from './simulationRun';

export class Project implements IProject {
  @ApiProperty({
    type: String,
    description:
      'Unique id of at least three letters, numbers, underscores, and dashes',
    pattern: '^[a-zA-Z0-9_-]{3,}$',
  })
  @IsString({
    message:
      "'id' must be a unique combination of at least three letters, numbers, underscores, and dashes",
  })
  @IsNotEmpty({
    message:
      "'id' must be a unique combination of at least three letters, numbers, underscores, and dashes",
  })
  @Matches(/^[a-zA-Z0-9_-]{3,}$/, {
    message:
      "'id' must be a unique combination of at least three letters, numbers, underscores, and dashes",
  })
  public id!: string;

  @ApiProperty({
    type: String,
    description: 'Id of the runBioSimulations simulation run for the project',
  })
  @IsString({
    message: "'simulationRun' must be the identifier of a simulation run",
  })
  @IsNotEmpty({
    message: "'simulationRun' must be the identifier of a simulation run",
  })
  @IsMongoId({
    message: "'simulationRun' must be the identifier of a simulation run",
  })
  public simulationRun!: string;

  @ApiResponseProperty({
    type: String,
    format: 'date-time',
    // description: 'Timestamp when the project was published'
  })
  public created!: string;

  @ApiResponseProperty({
    type: String,
    format: 'date-time',
    // description: 'Timestamp when the project was last updated'
  })
  public updated!: string;
}

export class ProjectInput extends OmitType(Project, ['created', 'updated']) implements IProjectInput {}

export class ModelSummary implements IModelSummary {
  @ApiProperty({
    type: String,
    description: 'Id of the model (combination of the location of the parent file of the model within the archive and the id of the model)',
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
    description: 'Location of the model relative to the location of its parent SED-ML file within its parent COMBINE/OMEX archive',
    example: './model.xml',
  })
  source!: string;

  @ApiProperty({
    type: String,
    description: 'Language of the model',
    example: 'urn:sedml:language:sbml',
  })
  language!: string;
}

export class SimulationSummary implements ISimulationSummary {
  @ApiProperty({
    type: String,
    enum: SimulationType,
    description: 'Type of the simulation',
  })
  _type!: SimulationType;

  @ApiProperty({
    type: String,
    description: 'Id of the simulation (combination of the location of the parent file of the simulation within the archive and the id of the simulation)',
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
    type: String,
    description: 'KiSAO id of the algorithm that executed the simulation',
    pattern: '^KISAO_\d{7,7}$',
    example: 'KISAO_0000019',
  })
  algorithm!: string;
}

@ApiExtraModels(ModelSummary)
@ApiExtraModels(SimulationSummary)
export class SimulationTaskSummary implements ISimulationTaskSummary {
  @ApiProperty({
    type: String,
    description: 'Id of the task (combination of the location of the parent file of the task within the archive and the id of the task)',
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
    type: ModelSummary,
    description: 'Summary of the model for the task',
  })
  model!: ModelSummary;

  @ApiProperty({
    type: SimulationSummary,
    description: 'Summary of the simulation for the task',
  })
  simulation!: SimulationSummary;
}

export class SimulationOutputSummary implements ISimulationOutputSummary {
  @ApiProperty({
    type: String,
    enum: SimulationOutputType,
    description: 'Type of the output',
  })
  _type!: SimulationOutputType;

  @ApiProperty({
    type: String,
    description: 'Id of the plot (combination of the location of the parent file of the output within the archive and the id of the output)',
    example: 'figure1/simulation.sedml/figure1a',
  })
  uri!: string;
  
  @ApiProperty({
    type: String,
    description: 'Name of the plot',
    example: 'Figure 1a',
  })
  name?: string;
}

@ApiExtraModels(EnvironmentVariable)
export class SimulationRunSummary implements ISimulationRunSummary {
  @ApiProperty({
    type: String,
    description: 'Id of the simulation run for the project',
    example: '5fab1cf714f9dd3dfbcfe51b',
  })
  id!: string;

  @ApiProperty({
    description: 'Name of the simulation run',
    type: String,
    example: 'Kockout of gene A',
  })
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
  simulator!: string;

  @ApiProperty({
    description: 'Version of the simulation tool to execute the simulation',
    type: String,
    example: '2.2.0',
  })
  simulatorVersion!: string;

  @ApiProperty({
    description: 'Digest of the simulation tool for the simulation run',
    type: String,
    pattern: '^sha256:[a-z0-9]{64,64}$',
    example:
      'sha256:5d1595553608436a2a343f8ab7e650798ef5ba5dab007b9fe31cd342bf18ec81',
  })
  simulatorDigest!: string;

  @ApiProperty({
    type: Number,
    description: 'Number of CPU cores needed to execute the simulation project',
  })
  cpus!: number;

  @ApiProperty({
    type: Number,
    description: 'Amount of RAM in GB needed to execute the simulation project',
  })
  memory!: number;

  @ApiProperty({
    type: [EnvironmentVariable],
    description:
      'Key-value pairs of environment variables to execute the simulator with',
  })
  envVars!: EnvironmentVariable[];

  @ApiProperty({
    description: 'Runtime of the simulation run in seconds',
    type: Number,
    example: 55,
  })
  runtime!: number;

  @ApiProperty({
    description: 'Size of the project (COMBINE/OMEX archive) for the simulation run',
    type: Number,
    example: 1123,
  })
  projectSize!: number;

  @ApiProperty({
    description: 'Size of the results (zip of reports and plots) for the simulation run',
    type: Number,
    example: 11234,
  })
  resultsSize!: number;

  @ApiProperty({
    description: 'Timestamp when the simulation run was submitted',
    type: String,
    format: 'date-time',
  })
  submitted!: string;

  @ApiProperty({
    description: 'Timestamp when the status of the simulation run was last updated',
    type: String,
    format: 'date-time',
  })
  updated!: string;
}

@ApiExtraModels(LabeledIdentifier)
@ApiExtraModels(DescribedIdentifier)
export class ProjectMetadataSummary implements ProjectMetadataSummary {
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

@ApiExtraModels(SimulationTaskSummary)
@ApiExtraModels(SimulationOutputSummary)
@ApiExtraModels(SimulationRunSummary)
@ApiExtraModels(ProjectMetadataSummary)
export class ProjectSummary implements IProjectSummary {
  @ApiProperty({
    type: String,
    description: 'Id of the project',
  })
  id!: string;

  @ApiProperty({
    type: [SimulationTaskSummary],
    description: 'Summary of the tasks of the simulation experiments for the project',
  })
  simulationTasks!: SimulationTaskSummary[];

  @ApiProperty({
    type: [SimulationOutputSummary],
    description: 'Summary of the outputs of the simulation experiments for the project',
  })
  simulationOutputs!: SimulationOutputSummary[];

  @ApiProperty({
    type: SimulationRunSummary,
    description: 'Summary of the simulation run for the project',
  })
  simulationRun!: SimulationRunSummary;

  @ApiProperty({
    type: ProjectMetadataSummary,
    description: 'Summary of the metadata for the project',
  })
  projectMetadata!: ProjectMetadataSummary;

  @ApiProperty({
    description: 'Timestamp when the project was created',
    type: String,
    format: 'date-time',
  })
  created!: string;

  @ApiProperty({
    description: 'Timestamp when the project was last updated',
    type: String,
    format: 'date-time',
  })
  updated!: string;
}
