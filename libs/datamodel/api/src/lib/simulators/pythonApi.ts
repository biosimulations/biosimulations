import { IPythonApi } from '@biosimulations/datamodel/common';

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PythonApi implements IPythonApi {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  public package!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  public module!: string;

  @IsString()
  @ApiProperty({
    type: String,
    nullable: true,
    description: 'URL for instructions for installing the Python API',
    example:
      'https://docs.biosimulators.org/Biosimulators_XPP/installation.html',
  })
  public installationInstructions!: string | null;
}
