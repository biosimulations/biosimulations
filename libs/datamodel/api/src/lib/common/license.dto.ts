import {
  License,
  LicenseInfo as ILicenseInfo,
} from '@biosimulations/datamodel/common';
import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsNumber, IsString, IsUrl } from 'class-validator';

export class LicenseInfo implements ILicenseInfo {
  @ApiProperty({ type: String, enum: License })
  @IsEnum(License)
  public value!: License;

  @ApiProperty({ type: String })
  @IsString()
  public name!: string;

  @ApiProperty({ type: String })
  @IsString()
  public version!: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  // TODO should this be changed to spdx?
  public swoId!: number;

  @ApiProperty({ type: String, format: 'url' })
  @IsUrl({ require_protocol: true })
  public url!: string;
}
