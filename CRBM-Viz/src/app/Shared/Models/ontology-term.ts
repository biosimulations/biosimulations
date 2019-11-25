export class OntologyTerm {
  ontology?: string;
  id?: string;
  name?: string;
  description?: string;
  iri: string;

  constructor (ontology?: string, id?: string, name?: string, description?: string, iri?: string) {
    this.ontology = ontology;
    this.id = id;
    this.name = name;
    this.description = description;
    this.iri = iri;
  }

  getUrl(): string {
    return `http://purl.bioontology.org/ontology/${ this.ontology }?conceptid=${ this.iri }`;
  }
}
