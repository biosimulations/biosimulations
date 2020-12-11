import { AccessLevel } from '@biosimulations/datamodel/common';
import { License } from './license';
import { SimulationResultsFormat } from '@biosimulations/datamodel/common';
import { SimulationRunStatus } from '@biosimulations/dispatch/api-models';
import { ParameterChange } from './parameter-change';
import { Algorithm } from './algorithm';
import { AlgorithmParameter } from './algorithm-parameter';
import { ChartType } from './chart-type';
import { Format } from './format';
import { Identifier } from './identifier';
import { Citation } from './journal-reference';
import { Model } from './model';
import { Person } from './person';
import { Project } from './project';
import { RemoteFile } from './remote-file';
import { Simulator } from './simulator';
import { Taxon } from './taxon';

import { User } from './user';
import { Visualization } from './visualization';
import { ProjectService } from '../Services/Resources/project.service';
import { UtilsService } from '../Services/utils.service';
import { ChartTypeService } from '../Services/Resources/chart-type.service';
import { VisualizationService } from '../Services/Resources/visualization.service';
import { ModelService } from '../Services/Resources/model.service';
import { UserService } from '../Services/user.service';
import { Observable } from 'rxjs';
import { TopLevelResource } from './top-level-resource';

export class Simulation extends TopLevelResource {
  model?: Model;
  MODEL?: string;
  format?: Format;
  modelParameterChanges?: ParameterChange[] = [];
  startTime?: number; // in seconds
  endTime?: number; // in seconds
  length?: number; // in seconds
  algorithm?: Algorithm; // KiSAO modeling and simulation algorithm
  algorithmParameterChanges?: ParameterChange[] = []; // KiSAO modeling and simulation algorithm parameter
  simulator?: Simulator;
  numTimePoints?: number;
  parent?: Simulation;
  owner?: User;
  status?: SimulationRunStatus;
  startDate?: Date; // date/time when simulation run started
  endDate?: Date; // date/time when simulation run finished
  wallTime?: number; // execution time in seconds
  outLog?: string;
  errLog?: string;

  public modelService: ModelService;
  public visualizationService: VisualizationService;
  public projectService: ProjectService;
  public chartTypeService: ChartTypeService;
  public userService: UserService;

  getIcon() {
    return { type: 'mat', icon: 'timeline' };
  }

  getRoute(): (string | number)[] {
    return ['/simulations', this.id];
  }

  getDescriptionFileUrl(): string {
    return '/assets/examples/simulation.xml';
  }

  // Size in Mb
  getDescriptionFileSize(): number {
    return 0.1;
  }

  getResultsFileUrl(format: SimulationResultsFormat): string {
    return '/assets/examples/simulation.ida';
  }

  // Size in Mb
  getResultsFileSize(format: SimulationResultsFormat): number {
    return 10.3;
  }

  getAuthors(): (User | Person)[] {
    if (this.authors && this.authors.length) {
      return this.authors;
    } else {
      return [this.owner];
    }
  }

  getProjects(): Observable<Project[]> {
    return this.projectService.list();
  }

  getModels(): Observable<Model[]> {
    return this.modelService.list();
  }

  getChartTypes(): Observable<ChartType[]> {
    return this.chartTypeService.list();
  }

  getVisualizations(): Observable<Visualization[]> {
    return this.visualizationService.list();
  }
}
