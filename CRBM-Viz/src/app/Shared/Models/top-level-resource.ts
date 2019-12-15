import { AccessLevel } from '../Enums/access-level';
import { License } from '../Enums/license';
import { Identifier } from './identifier';
import { JournalReference } from './journal-reference';
import { Person } from './person';
import { RemoteFile } from './remote-file';
import { User } from './user';

export interface TopLevelResource {
  id?: string;
  name?: string;
  image?: File | RemoteFile;
  description?: string;
  tags?: string[];
  identifiers?: Identifier[];
  refs?: JournalReference[];
  authors?: (User | Person)[];
  owner?: User;
  access?: AccessLevel;
  accessToken?: string;
  license?: License;
  created?: Date;
  updated?: Date;

  getIcon: () => object;
  getRoute: () => (string | number)[];
  getAuthors: () => (User | Person)[];
}
