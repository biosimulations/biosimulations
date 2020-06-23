import { License, LicenseInfo } from '@biosimulations/datamodel/core';
import { ApiProperty } from '@nestjs/swagger';

export class LicenseInfoDTO implements LicenseInfo {
  @ApiProperty({ enum: License })
  value!: License;
  @ApiProperty()
  name!: string;
  @ApiProperty()
  version!: string;
  @ApiProperty()
  swoId!: number;
  @ApiProperty()
  url!: string;
}
