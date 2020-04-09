import { AlgorithmParameterDTO } from './algorithm-parameter.dto';
import { ModelParameterDTO } from './model-parameter.dto';

export interface ParameterChangeDTO {
  parameter: ModelParameterDTO | AlgorithmParameterDTO;
  value: number;
}
