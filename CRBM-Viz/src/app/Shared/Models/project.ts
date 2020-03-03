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
import { Observable } from 'rxjs';
import { SimulationService } from '../Services/Resources/simulation.service';
import { VisualizationService } from '../Services/Resources/visualization.service';
import { ChartTypeService } from '../Services/Resources/chart-type.service';
import { UserService } from '../Services/user.service';
import { Model } from './model';
import { Simulation } from './simulation';
import { ChartType } from './chart-type';
import { Visualization } from './visualization';
import { ModelService } from '../Services/Resources/model.service';

export class Project extends TopLevelResource {
  id?: string;
  name?: string;

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

  public simulationService: SimulationService;
  public visualizationService: VisualizationService;
  public chartTypeService: ChartTypeService;
  public userservice: UserService;
  public modelService: ModelService;
  getIcon() {
    return { type: 'fas', icon: 'folder-open' };
  }

  getRoute(): (string | number)[] {
    return ['/projects', this.id];
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

  getVisualizations(): Observable<Visualization[]> {
    return this.visualizationService.list();
  }
}
