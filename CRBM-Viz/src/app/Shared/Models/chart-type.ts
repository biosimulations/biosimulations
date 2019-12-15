import { AccessLevel } from '../Enums/access-level';
import { ChartTypeDataFieldShape } from '../Enums/chart-type-data-field-shape';
import { License } from '../Enums/license';
import { ChartTypeDataField } from './chart-type-data-field';
import { Identifier } from './identifier';
import { JournalReference } from './journal-reference';
import { Model } from './model';
import { Person } from './person';
import { Project } from './project';
import { RemoteFile } from './remote-file';
import { Simulation } from './simulation';
import { User } from './user';
import { Visualization } from './visualization';
import { ModelService } from '../Services/model.service';
import { ProjectService } from '../Services/project.service';
import { SimulationService } from '../Services/simulation.service';
import { UtilsService } from '../Services/utils.service';
import { VisualizationService } from '../Services/visualization.service';

export class ChartType {
  id?: string;
  name?: string;
  spec?: object;
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

  getIcon() {
    return {type: 'fas', icon: 'chart-area'};
  }

  getRoute() {
    return ['/chart-types', this.id];
  }

  getAuthors(): (User | Person)[] {
    if (this.authors && this.authors.length) {
      return this.authors;
    } else {
      return [this.owner];
    }
  }

  getDataFields(): ChartTypeDataField[] {
    const fields: ChartTypeDataField[] = [];
    for (let iField = 0; iField < 3; iField++) {
      const field: ChartTypeDataField = new ChartTypeDataField();
      field.name = `field-${ iField + 1}`;
      field.shape = ChartTypeDataFieldShape.array;
      fields.push(field);
    }
    return fields;
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

  getVisualizations(): Visualization[] {
    return [
      VisualizationService._get(1),
      VisualizationService._get(2),
      VisualizationService._get(3),
    ];
  }
}
