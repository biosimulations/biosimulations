export class License {
  name?: string;
  swoId?: number;
  url?: string;

  constructor (name?: string, swoId?: number, url?: string) {
    this.name = name;
    this.swoId = swoId;
    this.url = url;
  }

  getSwoUrl(): string {
    return `http://bioportal.bioontology.org/ontologies/SWO?p=classes&conceptid=http://www.ebi.ac.uk/swo/license/SWO_${ this.swoId }`;
  }
}
