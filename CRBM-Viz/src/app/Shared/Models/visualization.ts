import { AccessLevel } from '../Enums/access-level';
import { License } from '../Enums/license';
import { Person } from './person';
import { Project } from './project';
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
  projects?: Project[] = [];

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
