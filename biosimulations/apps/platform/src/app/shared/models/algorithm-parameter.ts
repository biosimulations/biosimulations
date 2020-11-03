import { AlgorithmParameter as AlgorithmParameterDTO } from '@biosimulations/shared/datamodel';
import { JsonSerializable } from '@biosimulations/datamodel/utils';
import { AlgorithmParameterType } from '@biosimulations/shared/datamodel';

export class AlgorithmParameter
  implements JsonSerializable<AlgorithmParameterDTO> {
  name: string;
  id: string;
  value: number | boolean | string;
  kisaoId: string | null;
  type: AlgorithmParameterType;
  recommendedRange: (boolean | string | number)[] | null;
  constructor(data: AlgorithmParameterDTO) {
    this.name = data.name;
    this.id = data.id;
    this.value = data.value;
    this.type = data.type;
    this.kisaoId = data.kisaoId;
    this.recommendedRange = data.recommendedRange;
  }
  serialize(): AlgorithmParameterDTO {
    return {
      name: this.name,
      id: this.id,
      type: this.type,
      recommendedRange: this.recommendedRange,
      value: this.value,
      kisaoId: this.kisaoId,
    };
  }

  getUrl(): string | null {
    if (this.kisaoId) {
      const ontology = 'KISAO';
      const id: string = this.kisaoId;
      const iri = `http://www.biomodels.net/kisao/KISAO#KISAO_${id}`;
      return `http://purl.bioontology.org/ontology/${ontology}?conceptid=${iri}`;
    }
    return null;
  }
}
