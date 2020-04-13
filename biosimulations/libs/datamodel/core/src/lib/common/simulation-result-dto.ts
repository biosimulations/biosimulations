import { BiomodelVariableDTO } from './biomodel-variable.dto';
import { BiosimulationsId } from '../aliases/identity';
import { DTO } from '@biosimulations/datamodel/utils';

export class SimulationResultCore {
  simulation: BiosimulationsId;
  variable: BiomodelVariableDTO;
}

export type SimulationResultDTO = DTO<SimulationResultCore>;
