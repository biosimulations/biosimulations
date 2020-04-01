import { OntologyTermDTO } from '@biosimulations/datamodel/core';
import { JsonSerializable } from '@biosimulations/datamodel/utils';

export class OntologyTerm implements JsonSerializable<OntologyTermDTO> {
  public ontology?: string;
  public id?: string;
  public name?: string;
  public description?: string;
  public iri?: string;
  constructor(data: OntologyTermDTO) {
    Object.assign(this, data);
  }
  serialize(): OntologyTermDTO {
    return {
      ontology: this.ontology,
      id: this.id,
      name: this.name,
      description: this.description,
      iri: this.iri,
    };
  }
  getUrl(): string {
    return `http://purl.bioontology.org/ontology/${this.ontology}?conceptid=${this.iri}`;
  }
}
