export class JournalReference {
  authors?: string;
  title?: string;
  journal?: string;
  volume?: number | string;
  num?: number;
  pages?: string;
  year?: number;
  doi?: string;

  constructor(
    authors?: string,
    title?: string,
    journal?: string,
    volume?: number | string,
    num?: number,
    pages?: string,
    year?: number,
    doi?: string
) {
    this.authors = authors;
    this.title = title;
    this.journal = journal;
    this.volume = volume;
    this.num = num;
    this.pages = pages;
    this.year = year;
    this.doi = doi;
  }

  getUrl(): string {
    if (this.doi) {
      return 'https://doi.org/' + this.doi;
    } else {
      return null;
    }
  }
}
