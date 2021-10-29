import { ApiProperty, ApiResponseProperty, OmitType } from '@nestjs/swagger';
import {
  Project as IProject,
  ProjectInput as IProjectInput,
  ProjectSummary as IProjectSummary,
} from '@biosimulations/datamodel/common';
import { SimulationRunSummary } from './simulationRun';
import { IsNotEmpty, IsString, Matches, IsMongoId } from 'class-validator';

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

export class ProjectInput
  extends OmitType(Project, ['created', 'updated'])
  implements IProjectInput {}


export class ProjectSummary implements IProjectSummary {
  @ApiProperty({
    type: String,
    description:
      'Unique id of at least three letters, numbers, underscores, and dashes',
    pattern: '^[a-zA-Z0-9_-]{3,}$',
  })
  id!: string;

  @ApiProperty({
    type: SimulationRunSummary,
    description: 'Summary of the simulation run for the project',
  })
  simulationRun!: SimulationRunSummary;

  @ApiProperty({
    type: String,
    format: 'date-time',
    description: 'Timestamp when the project was published'
  })
  public created!: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
    description: 'Timestamp when the project was last updated'
  })
  public updated!: string;
}
