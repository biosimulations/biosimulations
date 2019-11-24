import { AccessLevel } from '../Enums/access-level';
import { SimulationStatus } from '../Enums/simulation-status';
import { ModelParameterChange } from './model-parameter-change';
import { AlgorithmParameter } from './algorithm-parameter';
import { Format } from './format';
import { Identifier } from './identifier';
import { JournalReference } from './journal-reference';
import { License } from './license';
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
  accessToken?: string;
  license?: License;
  status?: SimulationStatus;
  date?: Date; // date/time when simulation was requested
  startDate?: Date; // date/time when simulation run started
  endDate?: Date; // date/time when simulation run finished
  wallTime?: number; // execution time in seconds
  outLog?: string;
  errLog?: string;

  constructor(
    id?: string,
    name?: string,
    description?: string,
    tags?: string[],
    model?: Model,
    format?: Format,
    modelParameterChanges?: ModelParameterChange[],
    length?: number,
    simulator?: Simulator,
    parent?: Simulation,
    refs?: JournalReference[],
    owner?: User,
    access?: AccessLevel,
    status?: SimulationStatus,
    date?: Date,
    startDate?: Date,
    endDate?: Date,
    wallTime?: number,
    outLog?: string,
    errLog?: string,
    ) {
    if (!tags) {
      tags = [];
    }
    if (!modelParameterChanges) {
      modelParameterChanges = [];
    }
    if (!refs) {
      refs = [];
    }

    this.id = id;
    this.name = name;
    this.description = description;
    this.tags = tags;
    this.model = model;
    this.format = format;
    this.modelParameterChanges = modelParameterChanges;
    this.length = length;
    this.simulator = simulator;
    this.refs = refs;
    this.parent = parent;
    this.owner = owner;
    this.access = access;
    this.accessToken = UtilsService.genAccessToken();
    this.status = status;
    this.date = date;
    this.startDate = startDate;
    this.endDate = endDate;
    this.wallTime = wallTime;
    this.outLog = outLog;
    this.errLog = errLog;
  }

  getIcon() {
    return {type: 'mat', icon: 'timeline'};
  }

  getRoute(): (string | number)[] {
    return ['/simulations', this.id];
  }

  getDefinitionFileUrl(): string {
    return '/assets/examples/simulation.xml';
  }

  getResultsFileUrl(): string {
    return '/assets/examples/simulation.ida';
  }

  getAuthors(): (User | Person)[] {
    if (this.authors && this.authors.length) {
      return this.authors;
    } else {
      return [this.owner];
    }
  }
}
