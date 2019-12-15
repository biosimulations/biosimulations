import { AccessLevel } from '../Enums/access-level';
import { License } from '../Enums/license';
import { Identifier } from './identifier';
import { JournalReference } from './journal-reference';
import { Person } from './person';
import { ProjectProduct } from './project-product';
import { RemoteFile } from './remote-file';
import { TopLevelResource } from 'src/app/Shared/Models/top-level-resource';
import { User } from './user';
import { UtilsService } from '../Services/utils.service';

export class Project implements TopLevelResource {
  id?: string;
  name?: string;
  image?: File | RemoteFile;
  description?: string;
  tags?: string[] = [];
  identifiers?: Identifier[] = [];
  refs?: JournalReference[] = [];
  authors?: (User | Person)[] = [];
  owner?: User;
  access?: AccessLevel;
  accessToken?: string = UtilsService.genAccessToken();
  license?: License;
  created?: Date;
  updated?: Date;
  products?: ProjectProduct[] = [];

  getIcon() {
    return {type: 'fas', icon: 'folder-open'};
  }

  getRoute(): (string | number)[] {
    return ['/projects', this.id];
  }

  getAuthors(): (User | Person)[] {
    if (this.authors && this.authors.length) {
      return this.authors;
    } else {
      return [this.owner];
    }
  }
}
