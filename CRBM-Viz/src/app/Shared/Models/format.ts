export class Format {
  constructor(
    public name?: string,
    public version?: string,
    public edamId?: number,
    public url?: string
  ) {}
  serialize(): any {
    return {
      name: this.name,
      version: this.version,
      edamId: this.edamId,
      url: this.url,
    };
  }

  getFullName(): string {
    let fullName: string = this.name;
    if (this.version) {
      fullName += ' ' + this.version;
    }
    return fullName;
  }

  getEdamUrl(): string {
    return `http://bioportal.bioontology.org/ontologies/EDAM?p=classes&conceptid=format_${this.edamId}`;
  }
}
