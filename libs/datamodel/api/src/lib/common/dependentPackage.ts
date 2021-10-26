import { DependentPackage as IDependentPackage } from '@biosimulations/datamodel/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUrl } from 'class-validator';

export class DependentPackage implements IDependentPackage {
  @ApiProperty({ type: String })
  @IsString()
  public name!: string;

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'Required version',
    example: '>= 3.1.1',
  })
  @IsString()
  @IsOptional()
  public version!: string | null;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  public required!: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  public freeNonCommercialLicense!: boolean;

  @ApiProperty({ type: String, nullable: true, required: false, default: null })
  @IsOptional()
  @IsUrl({ require_protocol: true })
  public url!: string | null;
}
