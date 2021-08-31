import { IPythonApi } from '@biosimulations/datamodel/common';

import { ApiProperty } from '@nestjs/swagger';

export class PythonApi implements IPythonApi {
  @ApiProperty({ type: String })
  package!: string;

  @ApiProperty({ type: String })
  module!: string;
}
