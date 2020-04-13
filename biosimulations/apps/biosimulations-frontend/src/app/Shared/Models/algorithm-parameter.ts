import { AlgorithmParameterDTO } from '@biosimulations/datamodel/core';
import { JsonSerializable } from '@biosimulations/datamodel/utils';
import { PrimitiveType } from '@biosimulations/datamodel/core';

export class AlgorithmParameter
  implements JsonSerializable<AlgorithmParameterDTO> {
  name: string;
  id: string;
  value: number | boolean | string;
  kisaoId: string;
  type: PrimitiveType;
  recomendedRange: (boolean | string | number)[];
  constructor(data: AlgorithmParameterDTO) {
    Object.assign(this, data);
  }
  serialize(): AlgorithmParameterDTO {
    return {
      name: this.name,
      id: this.id,
      type: this.type,
      recomendedRange: this.recomendedRange,
      value: this.value,
      kisaoId: this.kisaoId,
    };
  }

  getUrl(): string {
    const ontology = 'KISAO';
    const id: string = this.kisaoId;
    const iri = `http://www.biomodels.net/kisao/KISAO#KISAO_${id}`;
    return `http://purl.bioontology.org/ontology/${ontology}?conceptid=${iri}`;
  }
}
