import { ApiProperty, ApiResponseProperty, OmitType } from '@nestjs/swagger';

export class Project {
  @ApiProperty({ type: String, description: 'Project id' })
  public id!: string;
  @ApiProperty({ type: String, description: 'Simulation Run id' })
  public simulationRun!: string;

  @ApiResponseProperty({})
  public created!: string;

  @ApiResponseProperty({})
  public updated!: string;
}

export class ProjectInput extends OmitType(Project, ['created', 'updated']) {}
