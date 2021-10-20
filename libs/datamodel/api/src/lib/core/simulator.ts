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
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

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

  @ApiResponseProperty({
    type: String,
    example: 'tellurium:2.1.6',
    // name: 'idVersion',
    // description: 'Id and version of the simulation tool',
  })
  idVersion!: string;

  @ApiProperty({
    type: String,
    example: 'tellurium',
    name: 'id',
    description: 'Id of the simulation tool',
  })
  id!: string;

  @ApiProperty({ type: String, example: 'tellurium' })
  name!: string;

  @ApiProperty({
    type: String,
    example: '2.1.6',
    description: 'Version of the simulation tool',
  })
  version!: string;

  @ApiProperty({
    type: String,
    description: 'Brief summary of the simulation tool',
    example:
      'tellurium is a Python-based environment for model building, simulation, and analysis that facilitates reproducibility of models in systems and synthetic biology.',
  })
  description!: string;

  @ApiProperty({
    type: [Url],
    description: 'URLs with additional information about the simulation tool',
  })
  urls!: Url[];

  @ApiProperty({
    nullable: true,
    type: Image,
    description: 'Standardized Docker image for the simulation tool',
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
    description: 'Standardized Python API for the simulation tool',
  })
  pythonApi!: PythonApi | null;

  @ApiProperty({
    type: [Person],
    description: 'Creators of the simulation tool',
  })
  authors!: Person[];

  @ApiProperty({
    type: ExternalReferences,
    description: 'Identifiers and citations for the simulation tool',
  })
  references!: ExternalReferences;

  @ApiProperty({
    type: SpdxOntologyId,
    nullable: true,
    description: 'License for the simulation tool',
  })
  license!: SpdxOntologyId | null;

  @ApiProperty({
    type: [Algorithm],
    description: 'Algorithms implemented by the simulation tool, with information about supported model formats, model changes, observables, and algorithm parameters',
  })
  algorithms!: Algorithm[];

  @ApiProperty({
    type: [String],
    enum: SoftwareInterfaceType,
    description: 'Available interfaces to the simulation tool',
  })
  interfaceTypes!: SoftwareInterfaceType[];

  @ApiProperty({
    type: [String],
    enum: OperatingSystemType,
    description: 'Operating systems that the simulation tool can be run on',
  })
  supportedOperatingSystemTypes!: OperatingSystemType[];

  @ApiProperty({
    type: [LinguistOntologyId],
    description: 'Programming languages which the simulation tool provides APIs for',
  })
  supportedProgrammingLanguages!: LinguistOntologyId[];

  @ApiProperty({
    type: [Funding],
    description: 'Funding which supported the development of the simulation tool',
  })
  funding!: Funding[];
}
