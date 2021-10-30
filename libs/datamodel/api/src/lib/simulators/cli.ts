import { ICli, PackageRepository } from '@biosimulations/datamodel/common';

import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class Cli implements ICli {
  @IsEnum(PackageRepository)
  @ApiProperty({
    type: String,
    enum: PackageRepository,
  })
  public packageRepository!: PackageRepository;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  public package!: string;

  @ApiProperty({
    type: String,
    description:
      'Command for running the command-line application, e.g., `biosimulators-tellurium`.',
  })
  @IsString()
  @IsNotEmpty()
  public command!: string;

  @IsOptional()
  @IsUrl({
    require_protocol: true,
    protocols: ['http', 'https'],
  })
  @ApiProperty({
    type: String,
    nullable: true,
    description:
      'URL for instructions for installing the command-line application',
    example:
      'https://docs.biosimulators.org/Biosimulators_XPP/installation.html',
  })
  public installationInstructions: string | null = null;
}
