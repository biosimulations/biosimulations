import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';


export class FieldsQueryParameters {
  @IsString({ each: true })
  @IsNotEmpty({each: true})
  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({ type: [String] })  
  @Transform((params) => {
    return params.value.split(',');
  })
  fields?: string[];
}


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
