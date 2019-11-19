import { AccessLevel } from '../Enums/access-level';
import { SimulationStatus } from '../Enums/simulation-status';
import { ChangedParameter } from './changed-parameter';
import { Format } from './format';
import { Identifier } from './identifier';
import { Model } from './model';
import { JournalReference } from './journal-reference';
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
  changedParameters?: ChangedParameter[] = [];
  length?: number;
  framework?: string;
  simulator?: Simulator;
  parent?: Simulation;
  refs?: JournalReference[] = [];
  authors?: (User | Person)[] = [];
  owner?: User;
  access?: AccessLevel;
  accessToken?: string;
  license?: string;
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
    changedParameters?: ChangedParameter[],
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
    if (!changedParameters) {
      changedParameters = [];
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
    this.changedParameters = changedParameters;
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

  getRoute() {
    return ['/simulate', this.id];
  }

  getAuthors(): (User | Person)[] {
    if (this.authors && this.authors.length) {
      return this.authors;
    } else {
      return [this.owner];
    }
  }
}
