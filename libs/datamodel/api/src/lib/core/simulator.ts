/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import {
  ExternalReferences,
  Person,
  Url,
  Funding,
  LinguistOntologyId,
  SpdxOntologyId,
} from '../common';
import {
  SoftwareInterfaceType,
  OperatingSystemType,
  ISimulator,
} from '@biosimulations/datamodel/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  Allow,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  NotEquals,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import {
  Image,
  Cli,
  PythonApi,
  Algorithm,
  BiosimulatorsMeta,
} from '../simulators';
import { Type } from 'class-transformer';

export class Simulator implements ISimulator {
  @Allow()
  @ApiProperty({ type: BiosimulatorsMeta })
  biosimulators!: BiosimulatorsMeta;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: 'tellurium',
    name: 'id',
  })
  id!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'tellurium' })
  name!: string;

  @NotEquals('latest')
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: '2.1.6',
  })
  version!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example:
      'tellurium is a Python-based environment for model building, simulation, and analysis that facilitates reproducibility of models in systems and synthetic biology.',
  })
  description!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Url)
  @ApiProperty({
    type: [Url],
  })
  urls!: Url[];

  @IsOptional()
  @ValidateNested()
  @Type(() => Image)
  @ApiProperty({
    nullable: true,
    type: Image,
  })
  image: Image | null = null;

  @IsOptional()
  @ValidateNested()
  @Type(() => Cli)
  @ApiProperty({
    nullable: true,
    type: Cli,
  })
  cli: Cli | null = null;

  @IsOptional()
  @ValidateNested()
  @Type(() => PythonApi)
  @ApiProperty({
    nullable: true,
    type: PythonApi,
  })
  pythonApi: PythonApi | null = null;

  @ValidateNested({ each: true })
  @Type(() => Person)
  @ApiProperty({ type: [Person] })
  authors!: Person[];

  @ValidateNested()
  @Type(() => ExternalReferences)
  @ApiProperty({ type: ExternalReferences })
  references!: ExternalReferences;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SpdxOntologyId)
  @ApiProperty({ type: SpdxOntologyId, nullable: true })
  license: SpdxOntologyId | null = null;

  @ValidateNested({ each: true })
  @Type(() => Algorithm)
  @ApiProperty({ type: [Algorithm] })
  algorithms!: Algorithm[];

  @IsEnum(SoftwareInterfaceType, { each: true })
  @ApiProperty({
    type: [String],
    enum: SoftwareInterfaceType,
  })
  interfaceTypes!: SoftwareInterfaceType[];

  @IsEnum(OperatingSystemType, { each: true })
  @ApiProperty({
    type: [String],
    enum: OperatingSystemType,
  })
  supportedOperatingSystemTypes!: OperatingSystemType[];

  @ValidateNested({ each: true })
  @Type(() => LinguistOntologyId)
  @ApiProperty({
    type: [LinguistOntologyId],
  })
  supportedProgrammingLanguages!: LinguistOntologyId[];

  @ValidateNested({ each: true })
  @Type(() => Funding)
  @ApiProperty({
    type: [Funding],
  })
  funding!: Funding[];
}
