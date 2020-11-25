import { Url as IUrl, UrlType } from '@biosimulations/datamodel/common';
import { ApiProperty } from '@nestjs/swagger';

export class Url implements IUrl {
  @ApiProperty({ type: String, format: 'url', example: 'http://tellurium.analogmachine.org/' })
  url!: string;

  @ApiProperty({ type: String, nullable: true, required: false, default: null, example: 'Home page' })
  title!: string | null;

  @ApiProperty({ type: String, enum: UrlType })
  type!: UrlType;
}
