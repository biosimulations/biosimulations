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
  Image,
  Cli,
  PythonApi,
  Algorithm,
  BiosimulatorsMeta,
} from '../simulators';

export class Simulator implements ISimulator {
  @ApiProperty({ type: BiosimulatorsMeta })
  biosimulators!: BiosimulatorsMeta;

  @ApiProperty({
    type: String,
    example: 'tellurium',
    name: 'id',
  })
  id!: string;

  @ApiProperty({ type: String, example: 'tellurium' })
  name!: string;

  @ApiProperty({
    type: String,
    example: '2.1.6',
  })
  version!: string;

  @ApiProperty({
    type: String,
    example:
      'tellurium is a Python-based environment for model building, simulation, and analysis that facilitates reproducibility of models in systems and synthetic biology.',
  })
  description!: string;

  @ApiProperty({
    type: [Url],
  })
  urls!: Url[];

  @ApiProperty({
    nullable: true,
    type: Image,
  })
  image!: Image | null;

  @ApiProperty({
    nullable: true,
    type: Cli,
  })
  cli!: Cli | null;

  @ApiProperty({
    nullable: true,
    type: PythonApi,
  })
  pythonApi!: PythonApi | null;

  @ApiProperty({ type: [Person] })
  authors!: Person[];

  @ApiProperty({ type: ExternalReferences })
  references!: ExternalReferences;

  @ApiProperty({ type: SpdxOntologyId, nullable: true })
  license!: SpdxOntologyId | null;

  @ApiProperty({ type: [Algorithm] })
  algorithms!: Algorithm[];

  @ApiProperty({
    type: [String],
    enum: SoftwareInterfaceType,
  })
  interfaceTypes!: SoftwareInterfaceType[];

  @ApiProperty({
    type: [String],
    enum: OperatingSystemType,
  })
  supportedOperatingSystemTypes!: OperatingSystemType[];

  @ApiProperty({
    type: [LinguistOntologyId],
  })
  supportedProgrammingLanguages!: LinguistOntologyId[];

  @ApiProperty({
    type: [Funding],
  })
  funding!: Funding[];
}
