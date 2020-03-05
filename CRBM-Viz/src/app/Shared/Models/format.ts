export interface FormatSerialized {
  name: string;
  version: string;
  edamId: number;
  url: string;
}
export class Format {
  constructor(
    public name: string = null,
    public version: string = null,
    public edamId: number = null,
    public url: string = null
  ) {
    if (!url && edamId) {
      this.url = this.getEdamUrl();
    }
  }
  serialize(): FormatSerialized {
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
