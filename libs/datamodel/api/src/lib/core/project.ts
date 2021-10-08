import { ApiProperty, ApiResponseProperty, OmitType } from '@nestjs/swagger';

export class Project {
  @ApiProperty({ 
    type: String, 
    description: 'Unique id of letters, numbers, underscores, and dashes (regular expression pattern ^[a-zA-Z0-9_-]{3,}$)',
  })
  public id!: string;

  @ApiProperty({ 
    type: String, 
    description: 'Id of the runBioSimulations simulation run for the project',
  })
  public simulationRun!: string;

  @ApiResponseProperty({})
  public created!: string;

  @ApiResponseProperty({})
  public updated!: string;
}

export class ProjectInput extends OmitType(Project, ['created', 'updated']) {}
