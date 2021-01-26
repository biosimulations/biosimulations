export class Simulator {
  name?: string;
  version?: string;
  image?: string;

  constructor(name?: string, version?: string, image?: string) {
    this.name = name;
    this.version = version;
    this.image = image;
  }

  getFullName(): string {
    let fullName: string = this.name;
    if (this.version) {
      fullName += ' ' + this.version;
    }
    return fullName;
  }
}
