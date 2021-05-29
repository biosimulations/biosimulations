export class StrictModeError {
  public name: 'StrictModeError' = 'StrictModeError';
  public path!: string;
  public immutable!: boolean;
  public msg!: string;
  public constructor(path: string, message: string, immutable: boolean) {
    this.msg = message;
    this.immutable = immutable;
    this.path = path;
  }
}
