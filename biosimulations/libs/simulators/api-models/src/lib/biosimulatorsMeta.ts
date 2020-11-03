import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { simulatorSpecificationsVersions, simulatorImageVersions } from '@biosimulations/shared/datamodel';

export class BiosimulatorsMeta {
  @ApiProperty({
    type: String,
    description:
      'The version of the BioSimulators simulator specifications format that the simulator specifications conforms to',
    examples: ['1.0.0'],
    enum: simulatorSpecificationsVersions,
  })
  specificationsVersion!: string;

  @ApiProperty({
    type: String,
    description:
      'The version of the BioSimulators simulator image format (command-line interface and Docker image structure) that the simulator implements',
    examples: ['1.0.0'],
    enum: simulatorImageVersions,
  })
  imageVersion!: string;
}
