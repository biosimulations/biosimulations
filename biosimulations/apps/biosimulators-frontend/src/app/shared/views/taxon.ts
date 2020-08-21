import { ViewModel } from './view';

export class Taxon extends ViewModel {
  constructor(readonly id: number, readonly name: string) {
    super();
    this.init();
  }
  getTooltip(): string {
    return 'Taxon';
  }
  toString(): string {
    return this.name;
  }
  getIcon(): 'taxon' {
    return 'taxon';
  }
  getLink(): string {
    return (
      'https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?mode=info&id=' +
      this.id
    );
  }
  match(predicate: any): boolean {
    throw new Error('Method not implemented.');
  }
}
