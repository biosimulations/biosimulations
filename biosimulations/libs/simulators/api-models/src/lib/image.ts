import {
  IImage,
} from '@biosimulations/datamodel/common';
import {
  EdamOntologyIdVersion,
} from '@biosimulations/datamodel/api';

import { ApiProperty } from '@nestjs/swagger';

export class Image implements IImage {
  @ApiProperty({ type: String, format: 'url' })
  url!: string;
  
  @ApiProperty({ type: EdamOntologyIdVersion })
  format!: EdamOntologyIdVersion;
}
