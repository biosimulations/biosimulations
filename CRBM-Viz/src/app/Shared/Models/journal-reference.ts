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

  getAuthors(): object[] {
    return this.authors.split(/ *(?:,|;|&|and|(?:(?:,|;) *(?:&|and))) */).map(name => {
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
        author['lastName']
        + ' '
        + author['firstName'][0]
        + author['middleNames'].map(name =>name[0]).join('')
        );
    });

    switch (authorStrs.length) {
      case 1:
        return authorStrs[0];
      case 2:
        return authorStrs.join(' & ');
      default:
        return authorStrs.slice(0, -1).join(', ') + ' & ' + authorStrs.slice(-1)[0];
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
        authorsStr = authorsArr[0]['lastName'] + ' and ' + authorsArr[1]['lastName'];
        break;
      default:
        authorsStr = authorsArr[0]['lastName'] + ' et al.';
        break;
    }

    return authorsStr + ' ' + this.year.toString();
  }

  getUrl(): string {
    if (this.doi) {
      return 'https://doi.org/' + this.doi;
    } else {
      return null;
    }
  }
}
