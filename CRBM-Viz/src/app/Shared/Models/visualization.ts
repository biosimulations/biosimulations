import { AccessLevel } from '../Enums/access-level';
import { License } from '../Enums/license';
import { JournalReference } from './journal-reference';
import { Person } from './person';
import { Project } from './project';
import { RemoteFile } from './remote-file';
import { SimulationResult } from './simulation-result';
import { User } from './user';
import { VisualizationLayoutElement } from './visualization-layout-element';
import { ProjectService } from '../Services/project.service';
import { UtilsService } from '../Services/utils.service';

export class Visualization {
  id?: number;
  name?: string;
  layout?: VisualizationLayoutElement[];
  image?: File | RemoteFile;
  description?: string;
  tags?: string[] = [];  
  data?: SimulationResult[];
  parent?: Visualization;
  refs?: JournalReference[] = [];
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

  getProjects(): Project[] {
    return [
      ProjectService._get('001'),
      ProjectService._get('002'),
      ProjectService._get('003'),
    ];
  }
}
