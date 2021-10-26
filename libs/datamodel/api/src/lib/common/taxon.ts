import { Taxon as ITaxon } from '@biosimulations/datamodel/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class Taxon implements ITaxon {
  @IsNumber()
  @ApiProperty({ type: Number, example: 9606 })
  public id!: number;

  @ApiProperty({ type: String, example: 'Homo sapiens' })
  @IsString()
  @IsNotEmpty()
  public name!: string;
}
