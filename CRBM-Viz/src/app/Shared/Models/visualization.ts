import { AccessLevel } from '../Enums/access-level';
import { License } from '../Enums/license';
import { Person } from './person';
import { User } from './user';
import { UtilsService } from '../Services/utils.service';

export class Visualization {
  id?: number;
  name?: string;
  description?: string;
  tags?: string[] = [];
  spec?: object | string;
  authors?: (User | Person)[] = [];
  owner?: User;
  access?: AccessLevel;
  accessToken?: string = UtilsService.genAccessToken();
  license?: License;
  created?: Date;
  updated?: Date;

  getIcon() {
    return {type: 'fas', icon: 'chart-area'};
  }

  getRoute() {
    return ['/visualizations', this.id];
  }

  getAuthors(): (User | Person)[] {
    if (this.authors && this.authors.length) {
      return this.authors;
    } else {
      return [this.owner];
    }
  }
}
