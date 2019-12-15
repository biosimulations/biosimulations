import { AccessLevel } from '../Enums/access-level';
import { ChartTypeDataFieldShape } from '../Enums/chart-type-data-field-shape';
import { ChartTypeDataFieldType } from '../Enums/chart-type-data-field-type';
import { License } from '../Enums/license';
import { ChartTypeDataField } from './chart-type-data-field';
import { Identifier } from './identifier';
import { JournalReference } from './journal-reference';
import { Model } from './model';
import { Person } from './person';
import { Project } from './project';
import { RemoteFile } from './remote-file';
import { Simulation } from './simulation';
import { TopLevelResource } from 'src/app/Shared/Models/top-level-resource';
import { User } from './user';
import { Visualization } from './visualization';
import { ModelService } from '../Services/model.service';
import { ProjectService } from '../Services/project.service';
import { SimulationService } from '../Services/simulation.service';
import { UtilsService } from '../Services/utils.service';
import { VisualizationService } from '../Services/visualization.service';

export class ChartType implements TopLevelResource {
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

    const specsToCheck = [this.spec];

    while(specsToCheck.length) {
      const spec: object = specsToCheck.pop();
      if ('data' in spec && 'name' in spec['data'] &&
        !('type' in spec['data'] &&
          spec['data']['type'] !== 'dynamicSimulationResult')) {
        fields.push(this.genDataField(spec));
      }

      if ('facet' in spec && 'spec' in spec) {
        specsToCheck.push(spec['spec']);
      }

      for (const compType of ['layer', 'hconcat', 'vconcat']) {
        if (compType in spec) {
          for (const layer of spec[compType]) {
            specsToCheck.push(layer)
          }
        }
      }
    }
    return fields;
  }

  genDataField(spec: object): ChartTypeDataField {
    const dataField = new ChartTypeDataField();
    dataField.name = spec['data']['name'];
    if ('shape' in spec['data']) {
      dataField.shape = ChartTypeDataFieldShape[spec['data']['shape'] as string];
    } else {
      dataField.shape = ChartTypeDataFieldShape.array;
    }
    dataField.type = ChartTypeDataFieldType.dynamicSimulationResult;
    return dataField;
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
      VisualizationService._get('001'),
      VisualizationService._get('002'),
      VisualizationService._get('003'),
    ];
  }
}
