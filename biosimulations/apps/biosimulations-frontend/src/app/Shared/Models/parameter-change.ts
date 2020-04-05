import { AlgorithmParameter } from './algorithm-parameter';
import { ModelParameter } from './model-parameter';
import { JsonSerializable } from '@biosimulations/datamodel/utils';
import {
  ParameterChangeDTO,
  isAlgorithmParameterDTO,
  isModelParameterDTO,
} from '@biosimulations/datamodel/core';

export class ParameterChange implements JsonSerializable<ParameterChangeDTO> {
  parameter: ModelParameter | AlgorithmParameter;
  modelParam: ModelParameter;
  algParam: AlgorithmParameter;
  value: number;
  serialize(): ParameterChangeDTO {
    return {
      parameter: this.parameter.serialize(),
      value: this.value,
    };
  }
  constructor(data: ParameterChangeDTO) {
    const param = data.parameter;
    if (isAlgorithmParameterDTO(param)) {
      this.algParam = new AlgorithmParameter(param);
    } else if (isModelParameterDTO(param)) {
      this.parameter = new ModelParameter(param);
    }

    this.value = data.value;
  }
}
