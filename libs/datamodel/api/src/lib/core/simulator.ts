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
  IsNotEmpty,
  IsString,
  ValidateNested,
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

  @ValidateNested()
  @Type(() => Image)
  @ApiProperty({
    nullable: true,
    type: Image,
  })
  image!: Image | null;

  @Allow()
  @ApiProperty({
    nullable: true,
    type: Cli,
  })
  cli!: Cli | null;

  @Allow()
  @ApiProperty({
    nullable: true,
    type: PythonApi,
  })
  pythonApi!: PythonApi | null;

  @Allow()
  @ApiProperty({ type: [Person] })
  authors!: Person[];

  @Allow()
  @ApiProperty({ type: ExternalReferences })
  references!: ExternalReferences;

  @Allow()
  @ApiProperty({ type: SpdxOntologyId, nullable: true })
  license!: SpdxOntologyId | null;

  @Allow()
  @ApiProperty({ type: [Algorithm] })
  algorithms!: Algorithm[];

  @Allow()
  @ApiProperty({
    type: [String],
    enum: SoftwareInterfaceType,
  })
  interfaceTypes!: SoftwareInterfaceType[];

  @Allow()
  @ApiProperty({
    type: [String],
    enum: OperatingSystemType,
  })
  supportedOperatingSystemTypes!: OperatingSystemType[];

  @Allow()
  @ApiProperty({
    type: [LinguistOntologyId],
  })
  supportedProgrammingLanguages!: LinguistOntologyId[];

  @Allow()
  @ApiProperty({
    type: [Funding],
  })
  funding!: Funding[];
}
