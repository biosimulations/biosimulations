export class Format {
  name: string;
  version: string;
    
  constructor (name?: string, version?: string) {
    this.name = name;
    this.version = version;
  }

  getFullName(): string {
    let fullName:string = this.name;
    if (this.version) {
        fullName += ' ' + this.version;
    }
    return fullName;
  }
}
