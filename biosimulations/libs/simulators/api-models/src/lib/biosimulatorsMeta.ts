import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import {
  IBiosimulatorsMeta,
  imageVersions,
  specificationVersions,
} from '@biosimulations/datamodel/common';

export class BiosimulatorsMeta implements IBiosimulatorsMeta {
  @ApiProperty({
    type: String,
    required: true,
    description:
      'The version of the BioSimulators simulator specifications format that the simulator specifications conforms to',
    examples: ['1.0.0'],
    enum: specificationVersions,
  })
  specificationVersion!: specificationVersions;

  @ApiProperty({
    type: String,
    required: true,
    description:
      'The version of the BioSimulators simulator image format (command-line interface and Docker image structure) that the simulator implements',
    examples: ['1.0.0'],
    enum: imageVersions,
  })
  imageVersion!: imageVersions;

  @ApiProperty({
    type: Boolean,
    description:
      'Whether or not the image for the simulator has passed validation',
  })
  validated!: boolean;

  @ApiResponseProperty({
    type: String,
    format: 'date-time',
    // description:
    //   'When the version of the simulator was catalogued in the BioSimulators registry',
  })
  created!: Date;

  @ApiResponseProperty({
    type: String,
    format: 'date-time',
    // description:
    //  'When the version of the simulator catalogued in the BioSimulators registry was last updated',
  })
  updated!: Date;
}
