import { IPythonApi } from '@biosimulations/datamodel/common';

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, IsOptional, IsUrl } from 'class-validator';

export class PythonApi implements IPythonApi {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  public package!: string;

  @Matches(/^[a-zA-Z_][a-zA-Z_0-9]*(\.[a-zA-Z_][a-zA-Z_0-9]*)*$/, {
    message: `Value is not not a valid name for a Python module (e.g., 'biosimulators_tellurium')`,
  })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  public module!: string;

  @IsOptional()
  @IsUrl({
    require_protocol: true,
    protocols: ['http', 'https'],
  })
  @ApiProperty({
    type: String,
    nullable: true,
    description: 'URL for instructions for installing the Python API',
    example:
      'https://docs.biosimulators.org/Biosimulators_XPP/installation.html',
  })
  public installationInstructions: string | null = null;
}
