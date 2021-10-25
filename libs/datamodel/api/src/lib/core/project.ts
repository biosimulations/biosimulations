import { ApiProperty, ApiResponseProperty, OmitType } from '@nestjs/swagger';
import { Project as IProject } from '@biosimulations/datamodel/common';

export class Project implements IProject {
  @ApiProperty({
    type: String,
    description:
      'Unique id of letters, numbers, underscores, and dashes (regular expression pattern ^[a-zA-Z0-9_-]{3,}$)',
  })
  public id!: string;

  @ApiProperty({
    type: String,
    description: 'Id of the runBioSimulations simulation run for the project',
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

export class ProjectInput extends OmitType(Project, ['created', 'updated']) {}
