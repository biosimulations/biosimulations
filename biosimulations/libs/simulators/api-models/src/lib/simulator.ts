import { ExternalReferences, Person, Url } from '@biosimulations/datamodel/api';
import { SoftwareInterfaceType, OperatingSystem } from '@biosimulations/datamodel/common';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { SpdxId } from '@biosimulations/datamodel/api';
import { Image } from './image';
import { Algorithm } from './algorithm';
import { gitHubLanguageTerms } from '@biosimulations/simulators/database-models';
import { BiosimulatorsMeta } from './biosimulatorsMeta';

export class Simulator {
  @ApiProperty({ type: BiosimulatorsMeta })
  biosimulators!: BiosimulatorsMeta;

  @ApiProperty({
    type: String,
    example: 'tellurium',
    name: 'id',
  })
  id!: string;

  @ApiProperty({ type: String, example: 'Tellurium' })
  name!: string;

  @ApiProperty({
    type: String,
    example: '2.1.6',
  })
  version!: string;

  @ApiProperty({
    type: String,
    example:
      'Tellurium is a Python-based environment for model building, simulation, and analysis that facilitates reproducibility of models in systems and synthetic biology.',
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

  @ApiProperty({ type: [Person] })
  authors!: Person[];

  @ApiProperty({ type: ExternalReferences })
  references!: ExternalReferences;

  @ApiProperty({ type: SpdxId, nullable: true })
  license!: SpdxId | null;

  @ApiProperty({ type: [Algorithm] })
  algorithms!: Algorithm[];

  @ApiProperty({
    type: [String],
    enum: SoftwareInterfaceType,
  })
  interfaceTypes!: SoftwareInterfaceType[];

  @ApiProperty({
    type: [String],
    enum: OperatingSystem,
  })
  supportedOperatingSystems!: OperatingSystem[];

  @ApiProperty({
    type: [String],
    enum: gitHubLanguageTerms,
  })
  supportedProgrammingLanguages!: string[];
}
