import { AlgorithmParameter } from './algorithm-parameter';
import { ModelParameter } from './model-parameter';
import { JsonSerializable } from '@biosimulations/datamodel/utils';
import {
  ParameterChangeDTO,
  isAlgorithmParameterDTO,
  AlgorithmParameterDTO,
  ModelParameterDTO,
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
      this.algParam = new AlgorithmParameter(param as AlgorithmParameterDTO);
    } else {
      this.parameter = new ModelParameter(data.parameter as ModelParameterDTO);
    }

    this.value = data.value;
  }
}
