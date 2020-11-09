import {
  Format as IFormat,
  IAlgorithm,
} from '@biosimulations/datamodel/common';
import {
  Citation,
  EdamOntologyId,
  KisaoOntologyId,
  SBOOntologyId,
} from '@biosimulations/datamodel/api';

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
