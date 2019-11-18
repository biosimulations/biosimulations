import { Identifier } from './identifier';

export class JournalReference {
  authors: string[];
  journal: string;
  volume: number | string;
  number: number;
  pages: string;
  year: number;
  identifiers: Identifier[];
    
  constructor(
    authors?: string[],
    journal?: string,
    volume?: number | string,
    number?: number,
    pages?: string,
    year?: number,
    identifiers?: Identifier[]
) {
    if (!authors) {
      authors = [];
    }
    if (!identifiers) {
      identifiers = [];
    }

    this.authors = authors;
    this.journal = journal;
    this.volume = volume;
    this.number = number;
    this.pages = pages;
    this.year = year;
    this.identifiers = identifiers;
  }

  getDoi(): string {
    for (const id of this.identifiers) {
      if (id.namespace == 'doi') {
        return id.id;
      }
    }
    return null;
  }

  getPubMedId(): string {
    for (const id of this.identifiers) {
      if (id.namespace == 'pubmed') {
        return id.id;
      }
    }
    return null;
  }

  getUrl(): string {
    const doi: string = this.getDoi();
    if (doi) {
      return 'https://doi.org/' + doi;  
    }

    const pubMedId: string = this.getPubMedId();
    if (pubMedId) {
      return 'https://www.ncbi.nlm.nih.gov/pubmed/' + pubMedId;  
    }

    return null;
  }
}
