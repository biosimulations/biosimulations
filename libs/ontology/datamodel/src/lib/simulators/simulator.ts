/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import {
  ExternalReferences,
  Person,
  Url,
  Cli,
  PythonApi,  
  BiosimulatorsMeta,
} from '@biosimulations/datamodel/api';
import { Funding } from './funding';
import { 
  LinguistOntologyId,
  SpdxOntologyId,
} from '../common';
import {
  SoftwareInterfaceType,
  OperatingSystemType,
  ISimulator,
  Ontologies,
} from '@biosimulations/datamodel/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Allow,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  NotEquals,
  ValidateNested,
  IsOptional,
  ArrayUnique,
} from 'class-validator';
import {
  Image,
  Algorithm,
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
  @ApiPropertyOptional({
    nullable: true,
    type: Image,
    required: false,
    default: null
  })
  image: Image | null = null;

  @IsOptional()
  @ValidateNested()
  @Type(() => Cli)
  @ApiPropertyOptional({
    nullable: true,
    type: Cli,
    required: false,
    default: null,
  })
  cli: Cli | null = null;

  @IsOptional()
  @ValidateNested()
  @Type(() => PythonApi)
  @ApiPropertyOptional({
    nullable: true,
    type: PythonApi,
    required: false,
    default: null
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
  @ApiPropertyOptional({
    type: SpdxOntologyId,
    nullable: true,
    required: false,
    default: null,
    example: {
      namespace: Ontologies.SPDX,
      id: 'MIT',
    }
  })
  license: SpdxOntologyId | null = null;

  @ArrayUnique((algorithm: Algorithm) => algorithm?.kisaoId?.id, {
    message:
      'Two or more algorithms have the same KiSAO id. Each algorithm must have a unique KiSAO id.',
  })
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
    example: [{
      namespace: Ontologies.Linguist,
      id: 'Python',
    }],
  })
  supportedProgrammingLanguages!: LinguistOntologyId[];

  @ValidateNested({ each: true })
  @Type(() => Funding)
  @ApiProperty({
    type: [Funding],
  })
  funding!: Funding[];
}
