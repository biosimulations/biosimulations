export class AlgorithmParameter {
  id?: string;
  name?: string;
  value?: number;
  kisaoId?: number;

  constructor (id?: string, name?: string, value?: number, kisaoId?: number) {
    this.id = id
    this.name = name;
    this.value = value;
    this.kisaoId = kisaoId;
  }

  getUrl(): string {
    const ontology = 'KISAO';
    const id: string = this.kisaoId.toString().padStart(7, '0');
    const iri = `http://www.biomodels.net/kisao/KISAO#KISAO_${ id }`;
    return `http://purl.bioontology.org/ontology/${ ontology }?conceptid=${ iri }`;
  }
}
