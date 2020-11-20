import {
  Format as IFormat,
  IAlgorithm,
} from '@biosimulations/datamodel/common';
import {
  Citation,
  EdamOntologyId,
  KisaoOntologyId,
  SboOntologyId,
} from '@biosimulations/datamodel/api';

import { ApiProperty } from '@nestjs/swagger';
import { AlgorithmParameter } from './algorithmParameter';

export class Algorithm implements IAlgorithm {
  @ApiProperty()
  kisaoId!: KisaoOntologyId;
  @ApiProperty({ type: [AlgorithmParameter], nullable: true, required: true })
  parameters!: AlgorithmParameter[] | null;

  @ApiProperty()
  id!: string;
  @ApiProperty()
  name!: string;

  @ApiProperty({ type: [SboOntologyId] })
  modelingFrameworks!: SboOntologyId[];

  @ApiProperty({ type: [EdamOntologyId] })
  modelFormats!: EdamOntologyId[];

  @ApiProperty({ type: [EdamOntologyId] })
  simulationFormats!: EdamOntologyId[];
  @ApiProperty({ type: [EdamOntologyId] })
  archiveFormats!: EdamOntologyId[];
  @ApiProperty({ type: [Citation] })
  citations!: Citation[];
}
