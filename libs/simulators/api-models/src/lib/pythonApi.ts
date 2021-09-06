import { IPythonApi } from '@biosimulations/datamodel/common';

import { ApiProperty } from '@nestjs/swagger';

export class PythonApi implements IPythonApi {
  @ApiProperty({ type: String })
  package!: string;

  @ApiProperty({ type: String })
  module!: string;

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'URL for instructions for installing the Python API',
    example: 'https://docs.biosimulators.org/Biosimulators_XPP/installation.html',
  })
  installationInstructions!: string | null;
}
