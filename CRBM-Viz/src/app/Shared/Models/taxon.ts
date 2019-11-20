export class Taxon {
  id?: number;
  name?: string;
    
  constructor(id?: number, name?: string) {
    this.id = id;
    this.name = name;
  }

  getShortName(): string {
    const parts: string[] = this.name.split(' ');
    return parts[0].substring(0, 1) + '. ' + parts.slice(1).join(' ');
  }

  getUrl(): string {
    return `https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=${ this.id }`;
  }
}
