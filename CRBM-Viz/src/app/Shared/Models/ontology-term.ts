export class OntologyTerm {
  constructor(
    public ontology?: string,
    public id?: string,
    public name?: string,
    public description?: string,
    public iri?: string
  ) {}
  serialize() {
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
