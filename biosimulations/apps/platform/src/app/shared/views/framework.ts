import { ViewModel } from './view';
import { OntologyTerm as IFramework } from '@biosimulations/shared/datamodel';
export class Framework extends ViewModel implements IFramework {
  constructor(
    public ontology: string,
    public id: string,
    public name: string,
    public description: string | null,
    public iri: string | null,
  ) {
    super();
    this.init();
  }

  static fromDTO(framework: IFramework) {
    return new Framework(
      framework.ontology,
      framework.id,
      framework.name,
      framework.description,
      framework.iri,
    );
  }
  getTooltip(): string {
    return 'Framework';
  }

  toString(): string {
    return this.name;
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
