import { AccessLevel } from '../Enums/access-level';
import { License } from '../Enums/license';
import { SimulationResultsFormat } from '../Enums/simulation-results-format';
import { SimulationStatus } from '../Enums/simulation-status';
import { ModelParameterChange } from './model-parameter-change';
import { AlgorithmParameter } from './algorithm-parameter';
import { Format } from './format';
import { Identifier } from './identifier';
import { JournalReference } from './journal-reference';
import { Model } from './model';
import { OntologyTerm } from './ontology-term';
import { Person } from './person';
import { Simulator } from './simulator';
import { Taxon } from './taxon';
import { User } from './user';
import { UtilsService } from '../Services/utils.service';

export class Simulation {
  id?: string;
  name?: string;
  description?: string;
  tags?: string[] = [];
  model?: Model;
  format?: Format;
  modelParameterChanges?: ModelParameterChange[] = [];
  startTime?: number; // in seconds
  endTime?: number; // in seconds
  length?: number; // in seconds
  algorithm?: OntologyTerm; // KISAO modeling and simulation algorithm
  algorithmParameters?: AlgorithmParameter[] = []; // KISAO modeling and simulation algorithm parameter
  simulator?: Simulator;
  numTimePoints?: number;
  parent?: Simulation;
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
}
