import { AlgorithmParameter } from './algorithm-parameter';
import {
  AlgorithmParameterDTO,
  AlgorithmDTO,
} from '@biosimulations/datamodel/core';
import { JsonSerializable } from '@biosimulations/datamodel/utils';
import { JsonCompatible } from '@biosimulations/datamodel/utils';

export class Algorithm implements JsonSerializable<AlgorithmDTO> {
  id?: string; // KISAO id
  name?: string;
  parameters: AlgorithmParameter[] = [];

  constructor(data: AlgorithmDTO) {
    this.id = data.id;
    this.name = data.name;
    this.parameters = data.parameters.map(
      (value: AlgorithmParameterDTO) => new AlgorithmParameter(value),
    );
  }
  serialize(): AlgorithmDTO {
    return {
      id: this.id,
      name: this.name,
      parameters: this.parameters.map((value: AlgorithmParameter) =>
        value.serialize(),
      ),
    };
  }

  getUrl(): string {
    return `http://www.biomodels.net/kisao/KISAO#KISAO_${this.id}`;
  }
}
