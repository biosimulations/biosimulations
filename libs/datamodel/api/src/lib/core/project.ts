import { ApiProperty, ApiResponseProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import {
  Project as IProject,
  ProjectFilterTarget,
  ProjectFilterStatsItem as IProjectFilterStatsItem,
  ProjectFilterQueryItem as IProjectFilterQueryItem,
  ProjectInput as IProjectInput,
  ProjectSummary as IProjectSummary,
  ProjectSummaryQueryResults as IProjectSummaryQueryResults,
  Account as IAccount,
  AccountType,
  Organization as IOrganization,
} from '@biosimulations/datamodel/common';
import { SimulationRunSummary } from './simulationRun';
import { IsNotEmpty, IsString, Matches, IsMongoId, IsOptional } from 'class-validator';

export class Project implements IProject {
  @ApiProperty({
    type: String,
    description: 'Unique id of at least three letters, numbers, underscores, and dashes',
    pattern: '^[a-zA-Z0-9_-]{3,}$',
  })
  @IsString({
    message: "'id' must be a unique combination of at least three letters, numbers, underscores, and dashes",
  })
  @IsNotEmpty({
    message: "'id' must be a unique combination of at least three letters, numbers, underscores, and dashes",
  })
  @Matches(/^[a-zA-Z0-9_-]{3,}$/, {
    message: "'id' must be a unique combination of at least three letters, numbers, underscores, and dashes",
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

export class ProjectInput extends OmitType(Project, ['created', 'updated']) implements IProjectInput {
  @ApiPropertyOptional({
    type: String,
    description:
      'Owner of the project. Administrators can use this attribute to submit projects on the behalf of other accounts',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public owner?: string;
}

export class Organization implements IOrganization {
  @ApiProperty({
    type: String,
    description: 'Id of the organization',
  })
  id!: string;

  @ApiProperty({
    type: String,
    description: 'Name of the organization',
  })
  name!: string;

  @ApiPropertyOptional({
    type: String,
    description: 'URL for the organization',
  })
  url?: string;
}

export class Account implements IAccount {
  @ApiProperty({
    type: String,
    description: 'Type of the account',
    enum: AccountType,
  })
  type!: AccountType;

  @ApiProperty({
    type: String,
    description: 'Id of the account',
  })
  id!: string;

  @ApiProperty({
    type: String,
    description: 'Name of the account',
  })
  name!: string;

  @ApiPropertyOptional({
    type: String,
    description: 'URL for the account',
  })
  url?: string;

  @ApiProperty({
    type: [Organization],
    description: 'Organizations that the account is a member of',
  })
  organizations!: Organization[];
}

export class ProjectSummary implements IProjectSummary {
  @ApiProperty({
    type: String,
    description: 'Unique id of at least three letters, numbers, underscores, and dashes',
    pattern: '^[a-zA-Z0-9_-]{3,}$',
  })
  id!: string;

  @ApiProperty({
    type: SimulationRunSummary,
    description: 'Summary of the simulation run for the project',
  })
  simulationRun!: SimulationRunSummary;

  @ApiProperty({
    type: Account,
    description: 'Owner of the project',
  })
  owner?: Account;

  @ApiProperty({
    type: String,
    format: 'date-time',
    description: 'Timestamp when the project was published',
  })
  public created!: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
    description: 'Timestamp when the project was last updated',
  })
  public updated!: string;
}

export class ProjectFilterStatsItem implements IProjectFilterStatsItem {
  @ApiProperty({
    type: String,
    description: 'total number of matching records, ignoring pagination',
    enum: ProjectFilterTarget,
  })
  public target!: ProjectFilterTarget;

  @ApiProperty({
    type: String,
    description: 'total number of matching records, ignoring pagination',
  })
  public valueFrequencies!: { value: string; count: number }[];
}

export class ProjectSummaryQueryResults implements IProjectSummaryQueryResults {
  @ApiProperty({
    type: [ProjectSummary],
    description: 'ProjectsSummary list returned by query',
  })
  projectSummaries!: ProjectSummary[];

  @ApiProperty({
    type: Number,
    description: 'total number of matching records, ignoring pagination',
  })
  totalMatchingProjectSummaries!: number;

  @ApiProperty({
    type: [ProjectFilterStatsItem],
    description: 'total number of matching records, ignoring pagination',
  })
  queryStats!: ProjectFilterStatsItem[];
}

export class ProjectFilterQueryItem implements IProjectFilterQueryItem {
  @ApiProperty({
    type: [String],
    description: 'ProjectsSummary list returned by query',
  })
  allowable_values!: string[];

  @ApiProperty({
    type: ProjectFilterTarget,
    description: 'ProjectsSummary list returned by query',
  })
  target!: ProjectFilterTarget;
}
