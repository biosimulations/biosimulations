import {
  Format as IFormat,
  IAlgorithm,
} from '@biosimulations/shared/datamodel';
import { Citation } from '@biosimulations/datamodel/api';

import {
  EdamOntologyId,
  OntologyId,
  KisaoOntologyId,
  SBOOntologyId,
} from './ontologyId';
import { ApiProperty } from '@nestjs/swagger';
import { AlgorithmParameter } from './algorithmParameter';

export class Algorithm implements IAlgorithm {
  @ApiProperty()
  kisaoId!: KisaoOntologyId;
  @ApiProperty({ type: [AlgorithmParameter] })
  parameters: AlgorithmParameter[] = [];

  @ApiProperty()
  id!: string;
  @ApiProperty()
  name!: string;

  @ApiProperty({ type: [SBOOntologyId] })
  modelingFrameworks!: SBOOntologyId[];

  @ApiProperty({ type: [EdamOntologyId] })
  modelFormats!: EdamOntologyId[];

  @ApiProperty({ type: [EdamOntologyId] })
  simulationFormats!: EdamOntologyId[];
  @ApiProperty({ type: [EdamOntologyId] })
  archiveFormats!: EdamOntologyId[];
  @ApiProperty({ type: [Citation] })
  citations!: Citation[];
}
