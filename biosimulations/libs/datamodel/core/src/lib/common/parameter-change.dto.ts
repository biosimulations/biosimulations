import { AlgorithmParameterDTO } from './algorithm-parameter.dto';
import { ModelParameterDTO } from './model-parameter.dto';

export class ParameterChangeDTO {
  parameter: ModelParameterDTO | AlgorithmParameterDTO;
  value: number;
}
