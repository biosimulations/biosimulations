import { IImage, OperatingSystemType } from '@biosimulations/datamodel/common';
import { EdamOntologyIdVersion } from '../common';

import { ApiProperty } from '@nestjs/swagger';

export class Image implements IImage {
  @ApiProperty({ type: String, format: 'url' })
  url!: string;

  @ApiProperty({ type: EdamOntologyIdVersion })
  format!: EdamOntologyIdVersion;

  @ApiProperty({ type: String, enum: OperatingSystemType, nullable: true })
  operatingSystemType!: OperatingSystemType | null;
}
