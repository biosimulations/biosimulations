export interface TaxonSerialized {
  id: number;
  name: string;
}
export class Taxon {
  constructor(public id?: number, public name?: string) {}
  serialize(): TaxonSerialized {
    return { id: this.id, name: this.name };
  }
  getShortName(): string {
    const parts: string[] = this.name.split(' ');
    return parts[0].substring(0, 1) + '. ' + parts.slice(1).join(' ');
  }

  getUrl(): string {
    return `https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=${this.id}`;
  }
}
