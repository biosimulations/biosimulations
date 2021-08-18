import { ApiProperty, ApiQuery } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { applyDecorators } from '@nestjs/common';

export class FieldsQueryParameters {
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  @ApiProperty({ type: [String] })
  @Transform((params) => {
    return params.value.split(',');
  })
  fields!: string[];
}

export const ApiFieldsQuery = (...args: string[]) =>
  applyDecorators(
    ApiQuery({
      name: 'fields',
      explode: false,
      style: 'form',
      type: String,
      isArray: true,
    }),
  );

// WIP can use this to define the query parameters for operations like sorting, filtering, paging, etc.
class FullJsonAPIQueryParameters {
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  @ApiProperty({ type: [String] })
  @Transform((params) => {
    return params.value.split(',');
  })
  fields!: string[];

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  @ApiProperty({ type: [String] })
  @Transform((params) => {
    return params.value.split(',');
  })
  sort!: string[];

  @IsInt()
  @IsArray()
  @IsOptional()
  @ApiProperty({ type: Number, format: 'int' })
  @Type(() => Number)
  page!: number;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  @ApiProperty({ type: [String] })
  @Transform((params) => {
    return params.value.split(',');
  })
  include!: string[];

  @IsOptional()
  //@ApiProperty({ type: [String] })
  // Maybe make this object
  filter!: string[];
}
