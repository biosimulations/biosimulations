import { AlgorithmParameter } from './algorithm-parameter';
import {
  AlgorithmParameterDTO,
  AlgorithmDTO,
  OntologyTermDTO,
} from '@biosimulations/datamodel/core';
import { JsonSerializable } from '@biosimulations/datamodel/utils';
import { JsonCompatible } from '@biosimulations/datamodel/utils';
import { OntologyTerm } from './ontology-term';
import { Format } from './format';

export class Algorithm implements JsonSerializable<AlgorithmDTO> {
  id?: string;
  name?: string;
  kisaoId: string;
  ontologyTerms: OntologyTerm[];
  modelingFrameworks: OntologyTerm[];
  modelFormats: Format[];
  parameters: AlgorithmParameter[] = [];
  mimetype?: string;
  extension?: string;
  sedUrn?: string;

  constructor(data: AlgorithmDTO) {
    Object.assign(this, data);
    this.parameters = data.parameters.map(
      (value: AlgorithmParameterDTO) => new AlgorithmParameter(value),
    );
  }
  serialize(): AlgorithmDTO {
    return {
      id: this.id,
      name: this.name,
      kisaoId: this.kisaoId,
      ontologyTerms: this.ontologyTerms.map((value: OntologyTerm) =>
        value.serialize(),
      ),
      modelingFrameworks: this.modelingFrameworks.map((value: OntologyTerm) =>
        value.serialize(),
      ),
      modelFormats: this.modelFormats.map((value: Format) => value.serialize()),

      parameters: this.parameters.map((value: AlgorithmParameter) =>
        value.serialize(),
      ),
    };
  }

  getUrl(): string {
    return `http://www.biomodels.net/kisao/KISAO#KISAO_${this.id}`;
  }
}
