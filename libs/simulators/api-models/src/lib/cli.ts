import { ICli, PackageRepository } from '@biosimulations/datamodel/common';

import { ApiProperty } from '@nestjs/swagger';

export class Cli implements ICli {
  @ApiProperty({
    type: String,
    enum: PackageRepository,
  })
  packageRepository!: PackageRepository;

  @ApiProperty({ 
    type: String 
  })
  package!: string;

  @ApiProperty({ 
    type: String,
    description: 'Command for running the command-line application, e.g., `biosimulators-tellurium`.',
  })
  command!: string;

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'URL for instructions for installing the command-line application',
    example:
      'https://docs.biosimulators.org/Biosimulators_XPP/installation.html',
  })
  installationInstructions!: string | null;
}
