import { Format as IFormat } from '@biosimulations/datamodel/common';
import { ApiProperty } from '@nestjs/swagger';

export class Format implements IFormat {
  @ApiProperty({ type: String })
  id!: string;

  @ApiProperty({ type: String })
  name!: string;

  @ApiProperty({ type: String })
  version!: string;

  @ApiProperty({ type: String, nullable: true })
  edamId!: string | null;

  @ApiProperty({ type: String, nullable: true })
  specUrl!: string | null;

  @ApiProperty({ type: String, nullable: true })
  url!: string | null;

  @ApiProperty({ type: String, nullable: true })
  mimetype!: string | null;

  @ApiProperty({ type: String, nullable: true })
  extension!: string | null;

  @ApiProperty({ type: String, nullable: true })
  sedUrn!: string | null;
}
