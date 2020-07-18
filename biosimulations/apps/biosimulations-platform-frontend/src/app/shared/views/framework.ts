import { ViewModel } from './view';
import { OntologyTerm as IFramework } from '@biosimulations/datamodel/core';
export class Framework implements ViewModel, IFramework {
  constructor(framework: IFramework) {
    this.ontology = framework.ontology;
    this.id = framework.id;
    this.name = framework.name;
    this.description = framework.description;
    this.iri = framework.iri;
  }
  ontology: string;
  id: string;
  name: string;
  description: string | null;
  iri: string | null;
  toString(): string {
    return this.name;
  }
  icon(): 'framework' {
    return 'framework';
  }
  link(): string | null {
    return this.iri;
  }
  match(predicate: any): boolean {
    throw new Error('Method not implemented.');
  }
}
