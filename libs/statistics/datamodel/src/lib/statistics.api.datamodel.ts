import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsNumber } from 'class-validator';
export class Statistic {
  @IsString()
  @ApiProperty()
  public id!: string;
  @IsArray()
  @ApiProperty()
  public labels: string[] = [];
  @IsNumber(
    {
      allowNaN: false,
      allowInfinity: false,
    },
    {
      each: true,
    },
  )
  @ApiProperty()
  public values: number[] = [];
}

export type StatisticType = Statistic;
