import { ViewModel } from './view';
import {
  IOntologyTerm as IFramework,
  Ontologies,
} from '@biosimulations/shared/datamodel';
export class Framework extends ViewModel implements IFramework {
  constructor(
    public namespace: Ontologies,
    public id: string,
    public name: string | null,
    public description: string | null,
    public iri: string | null
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
      framework.iri
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
