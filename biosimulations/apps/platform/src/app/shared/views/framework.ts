import { ViewModel } from './view';
import {
  IOntologyTerm as IFramework,
  Ontologies,
} from '@biosimulations/datamodel/common';
export class Framework extends ViewModel implements IFramework {
  constructor(
    public namespace: Ontologies,
    public id: string,
    public name: string,
    public description: string | null,
    public iri: string | null,
    public url: string,
  ) {
    super();
    this.init();
  }

  static fromDTO(framework: IFramework) {
    return new Framework(
      framework.namespace,
      framework.id,
      framework.name,
      framework.description,
      framework.iri,
      framework.url,
    );
  }
  getTooltip(): string {
    return 'Framework';
  }

  toString(): string {
    if (this.name) {
      return this.name;
    } else {
      return '';
    }
  }
  getIcon(): 'framework' {
    return 'framework';
  }
  getLink(): string | null {
    return this.iri;
  }
  match(predicate: any): boolean {
    throw new Error('Method not implemented.');
  }
}
