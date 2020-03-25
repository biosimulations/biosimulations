import { AlgorithmParameterDTO } from './algorithm-paramater.dto';
import { ModelParameterDTO } from './model-parameter.dto';

export class ParameterChangeDTO {
  parameter: ModelParameterDTO | AlgorithmParameterDTO;
  value: number;
}
