import { ViewModel } from './view';

export class Author extends ViewModel {
  constructor(
    private firstName: string | null,
    private lastName: string,
    private middleName: string | null,
  ) {
    super();
  }

  getTooltip(): string {
    return 'Authors';
  }

  getIcon(): 'author' {
    return 'author';
  }

  getLink(): string | null {
    return null;
  }

  match(predicate: any): boolean {
    throw new Error('Method not implemented.');
  }

  toString() {
    if (!this.middleName) {
      this.middleName = ' ';
    } else {
      this.middleName = ' ' + this.middleName + ' ';
    }
    return ' ' + this.firstName + this.middleName + this.lastName;
  }
}
