import {
  License,
  LicenseInfo as ILicenseInfo,
} from '@biosimulations/datamodel/common';
import { ApiProperty } from '@nestjs/swagger';

export class LicenseInfo implements ILicenseInfo {
  @ApiProperty({ type: String, enum: License })
  value!: License;

  @ApiProperty({ type: String })
  name!: string;

  @ApiProperty({ type: String })
  version!: string;

  @ApiProperty({ type: Number })
  swoId!: number;

  @ApiProperty({ type: String, format: 'url' })
  url!: string;
}
