import { Url as IUrl, UrlType } from '@biosimulations/datamodel/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsUrl, IsOptional } from 'class-validator';
export class Url implements IUrl {
  @IsUrl({
    require_protocol: true,
    protocols: ['http', 'https', 'ftp'],
  })
  @ApiProperty({
    type: String,
    format: 'url',
    example: 'http://tellurium.analogmachine.org/',
  })
  public url!: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    nullable: true,
    required: false,
    default: null,
    example: 'Home page',
  })
  public title!: string | null;

  @IsEnum(UrlType)
  @ApiProperty({ type: String, enum: UrlType })
  public type!: UrlType;
}
