import { Url as IUrl } from '@biosimulations/datamodel/common';
import { ApiProperty } from '@nestjs/swagger';

export class Url implements IUrl {
  @ApiProperty({ type: [String], format: 'url' })
  url!: string;

  @ApiProperty({ type: [String] })
  title!: string[];
}
