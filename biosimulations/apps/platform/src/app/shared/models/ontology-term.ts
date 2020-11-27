import { OntologyTerm as OntologyTermDTO } from '@biosimulations/datamodel/common';
import { JsonSerializable } from '@biosimulations/datamodel/utils';

export class OntologyTerm implements JsonSerializable<OntologyTermDTO> {
  public ontology: string;
  public id: string;
  public name: string | null;
  public description: string | null;
  public iri: string | null;
  public url: string | null;
  public moreInfoUrl: string | null;
  constructor(data: OntologyTermDTO) {
    this.ontology = data.ontology;
    this.id = data.id;
    this.name = data.name;
    this.description = data.name;
    this.iri = data.iri;
    this.url = data.url;
    this.moreInfoUrl = data.moreInfoUrl
  }
  serialize(): OntologyTermDTO {
    return {
      ontology: this.ontology,
      id: this.id,
      name: this.name,
      description: this.description,
      iri: this.iri,
      url: this.url,
      moreInfoUrl: this.moreInfoUrl,
    };
  }
  getUrl(): string {
    return this.url;
  }
}
