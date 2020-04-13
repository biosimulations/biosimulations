import {
  BiomodelParameterDTO,
  AlgorithmParameterDTO,
  SimulationRun,
  AlgorithmDTO,
} from '.';

import { FormatDTO } from '../..';
import { BiosimulationsId } from '../common/alias';

export interface ParameterChangeDTO {
  parameter: BiomodelParameterDTO | AlgorithmParameterDTO;
  value: number;
}

export class Simualtion {
  model: BiosimulationsId;
  format: FormatDTO;
  modelParameterChanges: ParameterChangeDTO[];
  algorithParameterChanges: ParameterChangeDTO[];
  algorithm: AlgorithmDTO;
  run: SimulationRun;
}
