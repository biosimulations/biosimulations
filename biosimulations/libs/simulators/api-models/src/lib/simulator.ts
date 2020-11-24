import { ExternalReferences, Person, Url } from '@biosimulations/datamodel/api';
import { SoftwareInterfaceType } from '@biosimulations/datamodel/common';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { SpdxId } from '@biosimulations/datamodel/api';
import { Image } from './image';
import { Algorithm } from './algorithm';
import { gitHubLanguageTerms } from '@biosimulations/simulators/database-models';
import { BiosimulatorsMeta } from './biosimulatorsMeta';

export class Simulator {
  @ApiProperty()
  biosimulators!: BiosimulatorsMeta;

  @ApiProperty({
    example: 'tellurium',
    name: 'id',
  })
  id!: string;

  @ApiProperty({ example: 'Tellurium' })
  name!: string;

  @ApiProperty({
    example: '2.1.6',
  })
  version!: string;

  @ApiProperty({
    example:
      'Tellurium is a Python-based environment for model building, simulation, and analysis that facilitates reproducibility of models in systems and synthetic biology.',
  })
  description!: string;

  @ApiProperty({
    example: 'http://tellurium.analogmachine.org/',
    format: 'url',
  })
  url!: string;

  @ApiProperty({
    nullable: true,
    type: Image,
  })
  image!: Image | null;

  @ApiProperty({ type: [Person] })
  authors!: Person[];

  @ApiProperty({ type: Url, nullable: true, required: false, default: null })
  contactUrl!: Url | null;

  @ApiProperty({ type: ExternalReferences })
  references!: ExternalReferences;

  @ApiProperty({ type: SpdxId, nullable: true })
  license!: SpdxId | null;

  @ApiProperty({ type: [Algorithm] })
  algorithms!: Algorithm[];

  @ApiProperty({
    type: [SoftwareInterfaceType],
    enum: SoftwareInterfaceType,
  })
  interfaceTypes!: SoftwareInterfaceType[];

  @ApiProperty({
    type: [String],
    enum: gitHubLanguageTerms,
  })
  supportedProgrammingLanguages!: string[];
}
