import { Citation as JournalReferenceDTO } from '@biosimulations/datamodel/common';
export interface JournalReferenceSerialized {
  authors?: string;
  title?: string;
  journal?: string;
  volume?: number | string;
  number?: number;
  pages?: string;
  year?: number;
}
interface Names {
  firstName: string;
  middleNames: string[];
  lastName: string;
}
export class Citation {
  public authors: string;
  public title: string;
  public journal: string;
  public volume: number | string | null;
  public num: number | string | null;
  public pages: string | null;
  public year: number;
  serialize(): JournalReferenceDTO {
    const json = {
      authors: this.authors,
      title: this.title,
      journal: this.journal,
      volume: this.volume,
      issue: this.num,
      pages: this.pages,
      year: this.year,
      doi: this.doi,
    };
    return json;
  }

  constructor(data: JournalReferenceDTO) {
    this.authors = data.authors;
    this.title = data.title;
    this.journal = data.journal;
    this.volume = data.volume;
    this.num = data.issue;
    this.pages = data.pages;
    this.year = data.year;
    this.doi = data.doi;
  }

  getAuthors(): Names[] {
    return this.authors
      .split(/ *(?:,|;|&|and|(?:(?:,|;) *(?:&|and))) */)
      .map((name) => {
        const names: string[] = name.split(/ +/);
        return {
          firstName: names[0],
          middleNames: names.slice(1, -1),
          lastName: names.slice(-1)[0],
        };
      });
  }

  getAuthorsStr(): string {
    const authorStrs: string[] = this.getAuthors().map((author) => {
      return (
        author['lastName'] +
        ' ' +
        author['firstName'][0] +
        author['middleNames'].map((name) => name[0]).join('')
      );
    });

    switch (authorStrs.length) {
      case 1:
        return authorStrs[0];
      case 2:
        return authorStrs.join(' & ');
      default:
        return (
          authorStrs.slice(0, -1).join(', ') + ' & ' + authorStrs.slice(-1)[0]
        );
    }
  }

  getShortName(): string {
    const authorsArr: Names[] = this.getAuthors();

    let authorsStr: string;
    switch (authorsArr.length) {
      case 1:
        authorsStr = authorsArr[0]['lastName'];
        break;
      case 2:
        authorsStr =
          authorsArr[0]['lastName'] + ' and ' + authorsArr[1]['lastName'];
        break;
      default:
        authorsStr = authorsArr[0]['lastName'] + ' et al.';
        break;
    }

    if (this.year) {
      authorsStr += ' ' + this.year.toString();
    }

    return authorsStr;
  }

  getUrl(): string | null {
    if (this.doi) {
      return 'https://doi.org/' + this.doi;
    } else {
      return null;
    }
  }

  toString() {
    return (
      this.getAuthorsStr() +
      ' . ' +
      this.title +
      '. <i>' +
      this.journal +
      '>/i>  <b>' +
      this.volume +
      '</b>' +
      ', ' +
      this.pages +
      '(' +
      this.year +
      ').'
    );
  }
}
