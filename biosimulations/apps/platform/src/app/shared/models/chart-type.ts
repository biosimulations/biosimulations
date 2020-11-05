import {
  ChartDataFieldShape,
  ChartDataFieldType,
  AccessLevel,
} from '@biosimulations/datamodel/common';
import { License } from './license';
import { ChartTypeDataField } from './chart-data-field';
import { Identifier } from './identifier';
import { Citation } from './journal-reference';
import { Model } from './model';
import { Person } from './person';
import { Project } from './project';
import { RemoteFile } from './remote-file';
import { Simulation } from './simulation';
import { TopLevelResource } from './top-level-resource';
import { User } from './user';
import { Visualization } from './visualization';
import { ModelService } from '../Services/Resources/model.service';
import { ProjectService } from '../Services/Resources/project.service';
import { SimulationService } from '../Services/Resources/simulation.service';
import { UtilsService } from '../Services/utils.service';
import { VisualizationService } from '../Services/Resources/visualization.service';
import { Observable } from 'rxjs';

export class ChartType extends TopLevelResource {
  name?: string;
  spec?: object;
  description?: string;
  tags?: string[] = [];
  identifiers?: Identifier[] = [];
  refs?: Citation[] = [];
  authors?: (User | Person)[] = [];
  owner?: User;
  access?: AccessLevel;
  accessToken?: string = UtilsService.genAccessToken();
  license?: License;
  created?: Date;
  updated?: Date;

  public modelService: ModelService;
  public simulationService: SimulationService;
  public visualizationService: VisualizationService;
  public projectService: ProjectService;

  getIcon() {
    return { type: 'fas', icon: 'chart-area' };
  }

  getRoute() {
    return ['/chart-types', this.id];
  }
  getDataFields(): ChartTypeDataField[] {
    const fields: ChartTypeDataField[] = [];

    const specsToCheck = [this.spec];

    while (specsToCheck.length) {
      const spec: object = specsToCheck.pop();
      if (
        'data' in spec &&
        'name' in spec['data'] &&
        !(
          'type' in spec['data'] &&
          spec['data']['type'] !== 'dynamicSimulationResult'
        )
      ) {
        fields.push(this.genDataField(spec));
      }

      if ('facet' in spec && 'spec' in spec) {
        specsToCheck.push(spec['spec']);
      }

      for (const compType of ['layer', 'hconcat', 'vconcat']) {
        if (compType in spec) {
          for (const layer of spec[compType]) {
            specsToCheck.push(layer);
          }
        }
      }
    }
    return fields;
  }

  genDataField(spec: object): ChartTypeDataField {
    const name = spec['data']['name'];
    let shape;
    if ('shape' in spec['data']) {
      shape = ChartDataFieldShape[spec['data']['shape'] as string];
    } else {
      shape = ChartDataFieldShape.array;
    }
    const type = ChartDataFieldType.dynamicSimulationResult;

    return new ChartTypeDataField({ name, shape, type });
  }

  getProjects(): Observable<Project[]> {
    return this.projectService.list();
  }

  getModels(): Observable<Model[]> {
    return this.modelService.list();
  }

  getSimulations(): Observable<Simulation[]> {
    return this.simulationService.list();
  }

  getVisualizations(): Observable<Visualization[]> {
    return this.visualizationService.list();
  }
}
