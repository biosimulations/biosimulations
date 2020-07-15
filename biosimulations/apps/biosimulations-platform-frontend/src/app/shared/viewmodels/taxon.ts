import { ViewModel } from './view';

export class Taxon implements ViewModel {
  constructor(readonly id: number, readonly name: string) {}
  toString(): string {
    return this.name;
  }
  icon(): 'taxon' {
    return 'taxon';
  }
  link(): string {
    return (
      'https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=' + this.id
    );
  }
  match(predicate: any): boolean {
    throw new Error('Method not implemented.');
  }
}
