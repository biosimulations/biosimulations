import { IImage, OperatingSystemType } from '@biosimulations/datamodel/common';
import { EdamOntologyIdVersion } from '../common';

import { ApiProperty } from '@nestjs/swagger';

export class Image implements IImage {
  @ApiProperty({
    type: String,
    description: 'URL for the image',
    example: 'ghcr.io/virtualcell/biosimulators_vcell:latest',
  })
  url!: string;

  @ApiProperty({
    type: String,
    description: 'Repository digest for the image',
    example: 'sha256:5d1595553608436a2a343f8ab7e650798ef5ba5dab007b9fe31cd342bf18ec81',
    pattern: '^sha256:[a-z0-9]{64,64}$'
  })
  digest!: string;

  @ApiProperty({ 
    type: EdamOntologyIdVersion,
    description: 'Format of the image',
  })
  format!: EdamOntologyIdVersion;

  @ApiProperty({ 
    type: String, 
    enum: OperatingSystemType, 
    nullable: true,
    description: 'Operating system in the image',
  })
  operatingSystemType!: OperatingSystemType | null;
}
