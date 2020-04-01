import { AlgorithmParameter } from './algorithm-parameter';
import { ModelParameter } from './model-parameter';
import { JsonSerializable } from '@biosimulations/datamodel/utils';
import {
  ParameterChangeDTO,
  instanceOfAlgorithmParameterDTO,
  AlgorithmParameterDTO,
  ModelParameterDTO,
} from '@biosimulations/datamodel/core';

export class ParameterChange implements JsonSerializable<ParameterChangeDTO> {
  parameter: ModelParameter | AlgorithmParameter;
  value: number;
  serialize(): ParameterChangeDTO {
    return {
      parameter: this.parameter.serialize(),
      value: this.value,
    };
  }
  constructor(data: ParameterChangeDTO) {
    if (instanceOfAlgorithmParameterDTO(data.parameter)) {
      this.parameter = new AlgorithmParameter(
        data.parameter as AlgorithmParameterDTO,
      );
    } else {
      this.parameter = new ModelParameter(data.parameter as ModelParameterDTO);
    }

    this.value = data.value;
  }
}
