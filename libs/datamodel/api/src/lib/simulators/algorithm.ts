import {
  IModelTarget,
  IModelSymbol,
  IModelChangePattern,
  IAlgorithm,
  IOutputVariablePattern,
  SoftwareInterfaceType,
  ModelChangeType,
  SimulationType,
} from '@biosimulations/datamodel/common';
import {
  Citation,
  EdamOntologyIdVersion,
  KisaoOntologyId,
  SboOntologyId,
  SioOntologyId,
  DependentPackage,
} from '../common';

import { ApiProperty } from '@nestjs/swagger';
import { AlgorithmParameter } from './algorithmParameter';

export class ModelTarget implements IModelTarget {
  @ApiProperty({ type: String, required: true })
  value!: string;

  @ApiProperty({ type: String, required: true })
  grammar!: string;
}

export class ModelSymbol implements IModelSymbol {
  @ApiProperty({ type: String, required: true })
  value!: string;

  @ApiProperty({ type: String, required: true })
  namespace!: string;
}

export class ModelChangePattern implements IModelChangePattern {
  @ApiProperty({ type: String, required: true })
  name!: string;

  @ApiProperty({
    type: [String],
    enum: ModelChangeType,
    required: true,
  })
  types!: ModelChangeType[];

  @ApiProperty({
    type: ModelTarget,
    nullable: true,
    required: false,
    default: null,
  })
  target!: ModelTarget | null;

  @ApiProperty({
    type: ModelSymbol,
    nullable: true,
    required: false,
    default: null,
  })
  symbol!: ModelSymbol | null;
}

export class OutputVariablePattern implements IOutputVariablePattern {
  @ApiProperty({ type: String, required: true })
  name!: string;

  @ApiProperty({
    type: ModelTarget,
    nullable: true,
    required: false,
    default: null,
  })
  target!: ModelTarget | null;

  @ApiProperty({
    type: ModelSymbol,
    nullable: true,
    required: false,
    default: null,
  })
  symbol!: ModelSymbol | null;
}

export class Algorithm implements IAlgorithm {
  @ApiProperty({ type: KisaoOntologyId })
  kisaoId!: KisaoOntologyId;

  @ApiProperty({ type: [AlgorithmParameter], nullable: true })
  parameters!: AlgorithmParameter[] | null;

  @ApiProperty({ type: [SioOntologyId], nullable: true })
  outputDimensions!: SioOntologyId[] | null;

  @ApiProperty({ type: [OutputVariablePattern], required: true })
  outputVariablePatterns!: OutputVariablePattern[];

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

  @ApiProperty({ type: [ModelChangePattern], required: true })
  modelChangePatterns!: ModelChangePattern[];

  @ApiProperty({ type: [EdamOntologyIdVersion] })
  simulationFormats!: EdamOntologyIdVersion[];

  @ApiProperty({
    type: [String],
    enum: SimulationType,
  })
  simulationTypes!: SimulationType[];

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
