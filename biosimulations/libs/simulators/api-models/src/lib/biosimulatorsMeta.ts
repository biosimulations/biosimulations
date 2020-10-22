import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BiosimulatorsMeta {
  @ApiProperty()
  schemaVersion!: string;

  @ApiProperty()
  imageVersion!: string;

  @ApiPropertyOptional()
  internal?: boolean;
}
