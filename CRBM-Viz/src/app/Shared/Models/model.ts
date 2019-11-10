import { Format } from './format'
import { Identifier } from './identifier'
import { Taxon } from './taxon'
import { User } from './user'

export class Model {
  id: string;
  name: string;
  tags: string[];
  taxon: Taxon;
  format: Format;
  identifiers: Identifier[];
  author: User;
  date: Date;

  constructor(
    id?: string,
    name?: string,
    tags?: string[],
    taxon?: Taxon,
    format?: Format,
    identifiers?: Identifier[],
    author?: User,
    date?: Date,
    ) {
    this.id = id;
    this.name = name;
    this.tags = tags;
    this.taxon = taxon;
    this.format = format;
    this.identifiers = identifiers;
    this.author = author;
    this.date = date;
  }
}
