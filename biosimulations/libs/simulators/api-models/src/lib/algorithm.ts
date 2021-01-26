import {
  IAlgorithm,
  IDependentVariableTargetPattern,
  SoftwareInterfaceType,
} from '@biosimulations/datamodel/common';
import {
  Citation,
  EdamOntologyIdVersion,
  KisaoOntologyId,
  SboOntologyId,
  SioOntologyId,
  DependentPackage,
} from '@biosimulations/datamodel/api';

import { ApiProperty } from '@nestjs/swagger';
import { AlgorithmParameter } from './algorithmParameter';

export class DependentVariableTargetPattern
  implements IDependentVariableTargetPattern {
  @ApiProperty({ type: String, required: true })
  variables!: string;

  @ApiProperty({ type: String, required: true })
  targetPattern!: string;
}

export class Algorithm implements IAlgorithm {
  @ApiProperty({ type: KisaoOntologyId })
  kisaoId!: KisaoOntologyId;

  @ApiProperty({ type: [AlgorithmParameter], nullable: true })
  parameters!: AlgorithmParameter[] | null;

  @ApiProperty({ type: [SioOntologyId], nullable: true })
  dependentDimensions!: SioOntologyId[] | null;

  @ApiProperty({ type: [DependentVariableTargetPattern], required: true })
  dependentVariableTargetPatterns!: DependentVariableTargetPattern[];

  @ApiProperty({
    description:
      'Id of the algorithm within the simulator such as the name of the function which implements the algorithm. The scope of this id is typically limited to the individual simulator.',
    type: String,
    nullable: true,
    required: false,
    default: null,
  })
  id!: string | null;

  @ApiProperty({
    description:
      'Name of the algorithm within the simulator. The scope of this name is typically limited to the individual simulator.',
    type: String,
    nullable: true,
    required: false,
    default: null,
  })
  name!: string | null;

  @ApiProperty({ type: [SboOntologyId] })
  modelingFrameworks!: SboOntologyId[];

  @ApiProperty({ type: [EdamOntologyIdVersion] })
  modelFormats!: EdamOntologyIdVersion[];

  @ApiProperty({ type: [EdamOntologyIdVersion] })
  simulationFormats!: EdamOntologyIdVersion[];

  @ApiProperty({ type: [EdamOntologyIdVersion] })
  archiveFormats!: EdamOntologyIdVersion[];

  @ApiProperty({
    type: [String],
    enum: SoftwareInterfaceType,
    description: 'List of software interfaces which support the parameter',
  })
  availableSoftwareInterfaceTypes!: SoftwareInterfaceType[];

  @ApiProperty({ type: [DependentPackage], nullable: true })
  dependencies!: DependentPackage[] | null;

  @ApiProperty({ type: [Citation] })
  citations!: Citation[];
}
