import { AlgorithmParameterDTO } from './algorithm-parameter.dto';
import { BiomodelParameterDTO } from './biomodel-parameter.dto';

export interface ParameterChangeDTO {
  parameter: BiomodelParameterDTO | AlgorithmParameterDTO;
  value: number;
}
