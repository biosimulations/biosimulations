import { AccessLevel } from '../Enums/access-level'
import { Format } from './format';
import { Identifier } from './identifier';
import { JournalReference } from './journal-reference';
import { Taxon } from './taxon';
import { User } from './user';
import { UtilsService } from '../Services/utils.service'

export class Model {
  id?: string;
  name?: string;
  description?: string;
  taxon?: Taxon;
  tags?: string[] = [];
  format?: Format;
  identifiers?: Identifier[] = [];
  refs?: JournalReference[] = [];
  owner?: User;
  access?: AccessLevel;
  accessToken?: string;
  license?: string;
  date?: Date;

  constructor(
    id?: string,
    name?: string,
    description?: string,
    taxon?: Taxon,
    tags?: string[],
    format?: Format,
    identifiers?: Identifier[],
    refs?: JournalReference[],
    owner?: User,
    date?: Date,
    ) {
    if (!tags) {
      tags = [];
    }
    if (!identifiers) {
      identifiers = [];
    }
    if (!refs) {
      refs = [];
    }

    this.id = id;
    this.name = name;
    this.description = description;
    this.taxon = taxon;
    this.tags = tags;
    this.format = format;
    this.identifiers = identifiers;
    this.refs = refs;
    this.owner = owner;
    // this.access = access;
    this.accessToken = new UtilsService().genAccessToken();
    // this.license = license;
    this.date = date;
  }

  getIcon() {
    return {type: 'fas', icon: 'project-diagram'};
  }

  getRoute() {
    return ['/model', this.id];
  }

  getBioModelsId(): string {
    for (const id of this.identifiers) {
      if (id.namespace == 'biomodels.db') {
        return id.id;
      }
    }
    return null;
  }

  getDoi() {
    for (const id of this.identifiers) {
      if (id.namespace == 'doi') {
        return id.id;
      }
    }
    return null;
  }

  getAuthors(): string[] {
    const authors: string[] = [];
    for (const ref of this.refs) {
      Array.prototype.push.apply(authors, ref.authors);
    }
    return authors;
  }
}
