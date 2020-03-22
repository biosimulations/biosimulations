import { AlgorithmParameter } from './algorithm-parameter';

export class Algorithm {
  id?: string; // KISAO id
  name?: string;
  parameters: AlgorithmParameter[] = [];

  constructor (id?: string, name?: string, parameters?: AlgorithmParameter[]) {
    if (!parameters) {
        parameters = [];
    }

    this.id = id;
    this.name = name;
    this.parameters = parameters;
  }

  getUrl(): string {
    return `http://www.biomodels.net/kisao/KISAO#KISAO_${ this.id }`;
  }
}
