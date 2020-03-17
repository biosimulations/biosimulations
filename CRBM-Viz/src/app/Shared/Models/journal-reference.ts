export interface JournalReferenceSerialized {
  authors?: string;
  title?: string;
  journal?: string;
  volume?: number | string;
  number?: number;
  pages?: string;
  year?: number;
  doi?: string;
}
export class JournalReference {
  serialize(): JournalReferenceSerialized {
    const json = {
      authors: this.authors,
      title: this.title,
      journal: this.journal,
      volume: this.volume,
      number: this.num,
      pages: this.pages,
      year: this.year,
      doi: this.doi,
    };
    return json;
  }
  constructor(
    public authors?: string,
    public title?: string,
    public journal?: string,
    public volume?: number | string,
    public num?: number,
    public pages?: string,
    public year?: number,
    public doi?: string
  ) {}

  getAuthors(): object[] {
    return this.authors
      .split(/ *(?:,|;|&|and|(?:(?:,|;) *(?:&|and))) */)
      .map(name => {
        const names: string[] = name.split(/ +/);
        return {
          firstName: names[0],
          middleNames: names.slice(1, -1),
          lastName: names.slice(-1)[0],
        };
      });
  }

  getAuthorsStr(): string {
    const authorStrs: string[] = this.getAuthors().map(author => {
      return (
        author['lastName'] +
        ' ' +
        author['firstName'][0] +
        author['middleNames'].map(name => name[0]).join('')
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
    const authorsArr: object[] = this.getAuthors();

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

  getUrl(): string {
    if (this.doi) {
      return 'https://doi.org/' + this.doi;
    } else {
      return null;
    }
  }
}
