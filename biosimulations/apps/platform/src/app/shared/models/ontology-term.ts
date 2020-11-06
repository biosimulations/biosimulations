import { OntologyTerm as OntologyTermDTO } from '@biosimulations/datamodel/common';
import { JsonSerializable } from '@biosimulations/datamodel/utils';

export class OntologyTerm implements JsonSerializable<OntologyTermDTO> {
  public ontology: string;
  public id: string;
  public name: string;
  public description: string;
  public iri: string | null;
  constructor(data: OntologyTermDTO) {
    this.ontology = data.ontology;
    this.id = data.id;
    this.name = data.name;
    this.description = data.name;
    this.iri = data.iri;
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
  getUrl(): string | null {
    if (this.ontology && this.iri) {
      return `http://purl.bioontology.org/ontology/${this.ontology}?conceptid=${this.iri}`;
    } else {
      return null;
    }
  }
}
