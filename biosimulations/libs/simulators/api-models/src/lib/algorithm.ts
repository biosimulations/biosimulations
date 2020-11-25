import {
  Format as IFormat,
  IAlgorithm,
  SoftwareInterfaceType,
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
  @ApiProperty({ type: KisaoOntologyId })
  kisaoId!: KisaoOntologyId;

  @ApiProperty({ type: [AlgorithmParameter], nullable: true })
  parameters!: AlgorithmParameter[] | null;

  @ApiProperty({
    description: "Id of the algorithm within the simulator such as the name of the function which implements the algorithm. The scope of this id is typically limited to the individual simulator.",
    type: String,
    nullable: true,
    required: false,
    default: null,
  })
  id!: string | null;

  @ApiProperty({
    description: "Name of the algorithm within the simulator. The scope of this name is typically limited to the individual simulator.",
    type: String,
    nullable: true,
    required: false,
    default: null
  })
  name!: string | null;

  @ApiProperty({ type: [SboOntologyId] })
  modelingFrameworks!: SboOntologyId[];

  @ApiProperty({ type: [EdamOntologyId] })
  modelFormats!: EdamOntologyId[];

  @ApiProperty({ type: [EdamOntologyId] })
  simulationFormats!: EdamOntologyId[];

  @ApiProperty({ type: [EdamOntologyId] })
  archiveFormats!: EdamOntologyId[];

  @ApiProperty({
    type: [String],
    enum: SoftwareInterfaceType,
    description: "List of software interfaces which support the parameter"
  })
  availableSoftwareInterfaceTypes!: SoftwareInterfaceType[];

  @ApiProperty({ type: [Citation] })
  citations!: Citation[];
}
