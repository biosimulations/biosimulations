import {
  ExternalReferences,
  Person,
} from '@biosimulations/shared/datamodel-api';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

import { Document } from 'mongoose';

import { EdamOntologyId, SpdxId } from './ontologyId';
import { Algorithm } from './algorithm';
import { BiosimulatorsMeta } from './biosimulatorsMeta';

export class Simulator extends Document {
  @ApiProperty({
    type: BiosimulatorsMeta,
  })
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
  })
  url!: string;

  @ApiProperty({
    example: 'docker.io/biosimulators/tellurium:2.1.6',
  })
  image!: string;

  @ApiProperty({ type: EdamOntologyId })
  format!: EdamOntologyId;

  @ApiProperty({ type: [Person] })
  authors!: Person[];
  @ApiProperty({ type: ExternalReferences })
  references!: ExternalReferences;
  @ApiProperty({ type: SpdxId })
  license!: SpdxId;
  @ApiProperty({ type: [Algorithm] })
  algorithms!: Algorithm[];

  @ApiResponseProperty({})
  created!: Date;
  @ApiResponseProperty({})
  updated!: Date;
}
