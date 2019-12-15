import { AccessLevel } from '../Enums/access-level';
import { License } from '../Enums/license';
import { ChartType } from './chart-type';
import { Identifier } from './identifier';
import { JournalReference } from './journal-reference';
import { Model } from './model';
import { Person } from './person';
import { Project } from './project';
import { RemoteFile } from './remote-file';
import { Simulation } from './simulation';
import { SimulationResult } from './simulation-result';
import { User } from './user';
import { VisualizationLayoutElement } from './visualization-layout-element';
import { ChartTypeService } from '../Services/chart-type.service';
import { ModelService } from '../Services/model.service';
import { ProjectService } from '../Services/project.service';
import { SimulationService } from '../Services/simulation.service';
import { UtilsService } from '../Services/utils.service';

export class Visualization {
  id?: number;
  name?: string;
  columns: number;
  layout?: VisualizationLayoutElement[];
  image?: File | RemoteFile;
  description?: string;
  tags?: string[] = [];
  data?: SimulationResult[];
  parent?: Visualization;
  identifiers?: Identifier[] = [];
  refs?: JournalReference[] = [];
  authors?: (User | Person)[] = [];
  owner?: User;
  access?: AccessLevel;
  accessToken?: string = UtilsService.genAccessToken();
  license?: License;
  created?: Date;
  updated?: Date;

  getIcon() {
    return {type: 'fas', icon: 'paint-brush'};
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

  getModels(): Model[] {
    return [
      ModelService._get('001'),
      ModelService._get('002'),
      ModelService._get('003'),
    ];
  }

  getSimulations(): Simulation[] {
    return [
      SimulationService._get('001'),
      SimulationService._get('002'),
      SimulationService._get('003'),
    ];
  }

  getChartTypes(): ChartType[] {
    return [
      ChartTypeService._get('001'),
      ChartTypeService._get('002'),
      ChartTypeService._get('003'),
    ];
  }
}
