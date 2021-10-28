import { KisaoOntologyId } from '../common';
import {
  AlgorithmParameter as IAlgorithmParameter,
  ValueType,
  SoftwareInterfaceType,
} from '@biosimulations/datamodel/common';

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class AlgorithmParameter implements IAlgorithmParameter {
  @ApiProperty({ type: KisaoOntologyId })
  @ValidateNested()
  @Type(() => KisaoOntologyId)
  public kisaoId!: KisaoOntologyId;

  @ApiProperty({
    description:
      "Id of the parameter within the simulator's implementation of the algorithm such as the name of a function argument which implements the parameter. The scope of this id is typically limited to the individual simulator.",
    type: String,
    nullable: true,
    required: false,
    default: null,
  })
  @IsOptional()
  @IsString()
  public id: string | null = null;

  @ApiProperty({
    description:
      "Name of the parameter within the simulator's implementation of the algorithm. The scope of this name is typically limited to the individual simulator.",
    type: String,
    nullable: true,
    required: false,
    default: null,
  })
  @IsString()
  @IsOptional()
  public name: string | null = null;

  @ApiProperty({
    type: String,
    enum: ValueType,
  })
  @IsEnum(ValueType)
  public type!: ValueType;

  @ApiProperty({
    type: String,
    example: '30.5',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  public value: string | null = null;

  @ApiProperty({
    type: [String],
    example: ['22.7', '2270'],
    nullable: true,
  })
  @IsString({ each: true })
  @IsOptional()
  public recommendedRange: string[] | null = null;

  @ApiProperty({
    type: [String],
    enum: SoftwareInterfaceType,
    description: 'List of software interfaces which support the parameter',
  })
  @IsEnum(SoftwareInterfaceType, { each: true })
  public availableSoftwareInterfaceTypes!: SoftwareInterfaceType[];
}
