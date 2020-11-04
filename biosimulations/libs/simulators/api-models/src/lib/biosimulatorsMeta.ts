import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IBiosimulatorsMeta,
  imageVersions,
  specificationVersions,
} from '@biosimulations/shared/datamodel';

export class BiosimulatorsMeta implements IBiosimulatorsMeta {
  @ApiProperty({
    default: '1.0.0',
    description:
      ' The version of the API schema that the properties of the simulators conforms to',
    examples: ['1.0.0'],
    enum: specificationVersions,
  })
  specificationVersion!: specificationVersions;

  @ApiProperty({
    type: String,
    default: '1.0.0',
    description:
      ' The version of the docker image interface and features supported by the image',
    examples: ['1.0.0'],
    enum: imageVersions,
  })
  imageVersion!: imageVersions;
}
