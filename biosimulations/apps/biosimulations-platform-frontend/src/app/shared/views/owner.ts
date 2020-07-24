import { ViewModel } from './view';

export class User extends ViewModel {
  constructor(private username: string) {
    super();
    this.init();
  }
  getTooltip(): string {
    return 'Owner';
  }
  getIcon(): 'user' {
    return 'user';
  }
  getLink(): string | null {
    return null;
  }
  match(predicate: any): boolean {
    throw new Error('Method not implemented.');
  }
  toString() {
    return this.username;
  }
}
