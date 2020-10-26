import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BiosimulatorsMeta {
  @ApiProperty({
    default: '1.0.0',
    description:
      ' The version of the API schema that the properties of the simulators conforms to',
    examples: ['1.0.0', '1.2.3'],
    enum: ['1.0.0'],
  })
  schemaVersion!: string;

  @ApiProperty({
    default: '1.0.0',
    description:
      ' The version of the docker image interface and features supported by the image',
    examples: ['1.0.0', '1.2.3'],
    enum: ['1.0.0'],
  })
  imageVersion!: string;

  @ApiPropertyOptional({
    description: 'True if the simulator is supported by the BioSimulators team',
  })
  internal?: boolean;
}
