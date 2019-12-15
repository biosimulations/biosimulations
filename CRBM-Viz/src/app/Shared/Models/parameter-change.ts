import { AlgorithmParameter } from './algorithm-parameter';
import { ModelParameter } from './model-parameter';

export class ParameterChange {
  parameter: ModelParameter | AlgorithmParameter;
  value: number;

  constructor (parameter?: ModelParameter | AlgorithmParameter, value?: number) {
    this.parameter = parameter;
    this.value = value;
  }
}
