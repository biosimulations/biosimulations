import { AlgorithmParameter as AlgorithmParameterDTO } from '@biosimulations/datamodel/common';
import { JsonSerializable } from '@biosimulations/datamodel/utils';
import { ValueType } from '@biosimulations/datamodel/common';

export class AlgorithmParameter
  implements JsonSerializable<AlgorithmParameterDTO>
{
  name: string | null;
  id: string;
  value: string | null;
  kisaoId: string | null;
  type: ValueType;
  recommendedRange: string[] | null;
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
