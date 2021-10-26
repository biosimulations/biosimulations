import { Format as IFormat } from '@biosimulations/datamodel/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class Format implements IFormat {
  @ApiProperty({ type: String })
  @IsString()
  public id!: string;

  @ApiProperty({ type: String })
  @IsString()
  public name!: string;

  @ApiProperty({ type: String })
  @IsString()
  public version!: string;

  @ApiProperty({ type: String, nullable: true })
  @IsString()
  @IsOptional()
  public edamId!: string | null;

  @ApiProperty({ type: String, nullable: true })
  @IsString()
  @IsOptional()
  public specUrl!: string | null;

  @ApiProperty({ type: String, nullable: true })
  @IsString()
  @IsOptional()
  public url!: string | null;

  @ApiProperty({ type: String, nullable: true })
  @IsString()
  @IsOptional()
  public mimetype!: string | null;

  @ApiProperty({ type: String, nullable: true })
  @IsString()
  @IsOptional()
  public extension!: string | null;

  @ApiProperty({ type: String, nullable: true })
  @IsString()
  @IsOptional()
  public sedUrn!: string | null;
}
