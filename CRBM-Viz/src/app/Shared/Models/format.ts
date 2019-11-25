export class Format {
  name?: string;
  version?: string;
  edamId?: number;
  url?: string;

  constructor (name?: string, version?: string, edamId?: number, url?: string) {
    this.name = name;
    this.version = version;
    this.edamId = edamId;
    this.url = url;
  }

  getFullName(): string {
    let fullName:string = this.name;
    if (this.version) {
        fullName += ' ' + this.version;
    }
    return fullName;
  }

  getEdamUrl(): string {
    return `http://bioportal.bioontology.org/ontologies/EDAM?p=classes&conceptid=format_${ this.edamId }`;
  }
}
