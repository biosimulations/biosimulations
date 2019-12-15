import { AccessLevel } from '../Enums/access-level';
import { License } from '../Enums/license';
import { SimulationResultsFormat } from '../Enums/simulation-results-format';
import { SimulationStatus } from '../Enums/simulation-status';
import { ParameterChange } from './parameter-change';
import { Algorithm } from './algorithm';
import { AlgorithmParameter } from './algorithm-parameter';
import { ChartType } from './chart-type';
import { Format } from './format';
import { Identifier } from './identifier';
import { JournalReference } from './journal-reference';
import { Model } from './model';
import { OntologyTerm } from './ontology-term';
import { Person } from './person';
import { Project } from './project';
import { RemoteFile } from './remote-file';
import { Simulator } from './simulator';
import { Taxon } from './taxon';
import { User } from './user';
import { Visualization } from './visualization';
import { ProjectService } from '../Services/project.service';
import { UtilsService } from '../Services/utils.service';
import { ChartTypeService } from '../Services/chart-type.service';
import { VisualizationService } from '../Services/visualization.service';


export class Simulation {
  id?: string;
  name?: string;
  image?: File | RemoteFile;
  description?: string;
  tags?: string[] = [];
  model?: Model;
  format?: Format;
  modelParameterChanges?: ParameterChange[] = [];
  startTime?: number; // in seconds
  endTime?: number; // in seconds
  length?: number; // in seconds
  algorithm?: Algorithm; // KISAO modeling and simulation algorithm
  algorithmParameterChanges?: ParameterChange[] = []; // KISAO modeling and simulation algorithm parameter
  simulator?: Simulator;
  numTimePoints?: number;
  parent?: Simulation;
  identifiers?: Identifier[] = [];
  refs?: JournalReference[] = [];
  authors?: (User | Person)[] = [];
  owner?: User;
  access?: AccessLevel;
  accessToken?: string = UtilsService.genAccessToken();
  license?: License;
  status?: SimulationStatus;
  created?: Date; // date/time when simulation was requested
  updated?: Date; // date/time when simulation was last updated
  startDate?: Date; // date/time when simulation run started
  endDate?: Date; // date/time when simulation run finished
  wallTime?: number; // execution time in seconds
  outLog?: string;
  errLog?: string;

  getIcon() {
    return {type: 'mat', icon: 'timeline'};
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

  getProjects(): Project[] {
    return [
      ProjectService._get('001'),
      ProjectService._get('002'),
      ProjectService._get('003'),
    ];
  }

  getChartTypes(): ChartType[] {
    return [
      ChartTypeService._get('001'),
      ChartTypeService._get('002'),
      ChartTypeService._get('003'),
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
