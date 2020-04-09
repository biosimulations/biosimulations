import { ModelVariableDTO } from './model-variable.dto';
import { BiosimulationsId } from '../aliases/identity';
import { DTO } from '@biosimulations/datamodel/utils';

export class SimulationResultCore {
  simulation: BiosimulationsId;
  variable: ModelVariableDTO;
}

export type SimulationResultDTO = DTO<SimulationResultCore>;
