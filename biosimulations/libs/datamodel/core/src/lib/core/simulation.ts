import {
  BiomodelParameterDTO,
  AlgorithmParameterDTO,
  SimulationRunAttributes,
  AlgorithmDTO,
} from '.';

import { FormatDTO } from '../..';
import { BiosimulationsId } from '../common/alias';

export interface ParameterChangeDTO {
  parameter: BiomodelParameterDTO | AlgorithmParameterDTO;
  value: number;
}

export class SimulationAttributes {
  model: BiosimulationsId;
  format: FormatDTO;
  modelParameterChanges: ParameterChangeDTO[];
  algorithmParameterChanges: ParameterChangeDTO[];
  algorithm: AlgorithmDTO;
  runs: BiosimulationsId[];
  numTimepoints: number;
  outputStartTime: number;
  startTime: number;
  endTime: number;
}
