import { DependentPackage as IDependentPackage } from '@biosimulations/datamodel/common';
import { ApiProperty } from '@nestjs/swagger';

export class DependentPackage implements IDependentPackage {
  @ApiProperty({ type: String })
  name!: string;

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'Required version',
    example: '>= 3.1.1',
  })
  version!: string | null;

  @ApiProperty({ type: Boolean })
  required!: boolean;

  @ApiProperty({ type: Boolean })
  freeNonCommercialLicense!: boolean;

  @ApiProperty({ type: String, nullable: true, required: false, default: null })
  url!: string | null;
}
