import { AlgorithmParameter } from './algorithm-parameter';
import {
  AlgorithmParameterDTO,
  AlgorithmDTO,
} from '@biosimulations/datamodel/core';

export class Algorithm {
  id?: string; // KISAO id
  name?: string;
  parameters: AlgorithmParameter[] = [];

  constructor(data: AlgorithmDTO) {
    this.id = data.id;
    this.name = data.name;
    this.parameters = [];
    data.parameters.forEach((element: AlgorithmParameterDTO) => {
      this.parameters.push(new AlgorithmParameter(element));
    });
  }

  getUrl(): string {
    return `http://www.biomodels.net/kisao/KISAO#KISAO_${this.id}`;
  }
}
