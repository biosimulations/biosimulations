import { ViewModel } from './view';

export class Author implements ViewModel {
  constructor(
    private firstName: string,
    private lastName: string,
    private middleName: string | null,
  ) {}
  icon(): 'authors' {
    return 'authors';
  }
  link(): string | null {
    return null;
  }
  match(predicate: any): boolean {
    throw new Error('Method not implemented.');
  }
  toString() {
    if (!this.middleName) {
      this.middleName = '';
    }
    return this.firstName + ' ' + this.middleName + ' ' + this.lastName;
  }
}
