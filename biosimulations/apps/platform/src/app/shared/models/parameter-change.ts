import { AlgorithmParameter } from './algorithm-parameter';
import { ModelParameter } from './model-parameter';
import { JsonSerializable } from '@biosimulations/datamodel/utils';
import {
  ParameterChange as ParameterChangeDTO,
  isAlgorithmParameter as isAlgorithmParameterDTO,
  isBiomodelParameter as isBiomodelParameterDTO,
} from '@biosimulations/datamodel/common';

export class ParameterChange {
  parameter!: ModelParameter | AlgorithmParameter;
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
      this.parameter = new AlgorithmParameter(param);
    } else if (isBiomodelParameterDTO(param)) {
      this.parameter = new ModelParameter(param);
    }

    this.value = data.value;
  }
}
