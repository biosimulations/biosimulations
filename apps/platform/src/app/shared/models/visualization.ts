import { AccessLevel } from '@biosimulations/datamodel/common';
import { License } from './license';
import { ChartType } from './chart-type';
import { Identifier } from './identifier';
import { Citation } from './journal-reference';
import { Model } from './model';
import { Person } from './person';
import { Project } from './project';
import { RemoteFile } from './remote-file';
import { Simulation } from './simulation';
import { SimulationResult } from './simulation-result';
import { TopLevelResource } from './top-level-resource';
import { User } from './user';
import { VisualizationLayoutElement } from './visualization-layout-element';
import { ChartTypeService } from '../Services/Resources/chart-type.service';
import { ModelService } from '../Services/Resources/model.service';
import { ProjectService } from '../Services/Resources/project.service';
import { SimulationService } from '../Services/Resources/simulation.service';
import { UtilsService } from '../Services/utils.service';
import { Observable, of } from 'rxjs';
import { UserService } from '../Services/user.service';
import { tap } from 'rxjs/operators';

export class Visualization extends TopLevelResource {
  columns: number;
  layout?: VisualizationLayoutElement[];
  data?: SimulationResult[];
  parent?: Visualization;
  owner: User;
  owner$: Observable<User>;

  public modelService: ModelService;
  public simulationService: SimulationService;
  public projectService: ProjectService;
  public chartTypeService: ChartTypeService;
  public userService: UserService;

  getIcon() {
    return { type: 'fas', icon: 'paint-brush' };
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

  getRows(): number {
    return Math.ceil(this.layout.length / this.columns);
  }

  getSpec(): object {
    if (this.layout && this.layout.length === 0) {
      return null;
    } else if (this.layout.length === 1) {
      return this.layout[0].chartType.spec;
    } else {
      const spec: object = {
        $schema: this.layout[0].chartType.spec['$schema'],
        vconcat: [],
      };
      const rows = this.getRows();
      for (let iRow = 0; iRow < rows; iRow++) {
        const maxColumns: number = Math.min(
          this.columns,
          this.layout.length - iRow * this.columns,
        );
        const row = [];
        spec['vconcat'].push({ hconcat: row });
        for (let iCol = 0; iCol < maxColumns; iCol++) {
          const specCopy: object = {};
          Object.assign(
            specCopy,
            this.layout[iRow * this.columns + iCol].chartType.spec,
          );
          for (const prop of ['autosize', 'height', 'width']) {
            if (prop in specCopy) {
              delete specCopy[prop];
            }
          }
          row.push(specCopy);
        }
      }
      return spec;
    }
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

  getChartTypes(): Observable<ChartType[]> {
    return this.chartTypeService.list();
  }
}
