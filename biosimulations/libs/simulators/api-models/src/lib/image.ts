import {
  IImage,
} from '@biosimulations/datamodel/common';
import {
  EdamOntologyId,
} from '@biosimulations/datamodel/api';

import { ApiProperty } from '@nestjs/swagger';

export class Image implements IImage {
  @ApiProperty({ type: String })
  url!: string;
  
  @ApiProperty({ type: EdamOntologyId })
  format!: EdamOntologyId;
}
