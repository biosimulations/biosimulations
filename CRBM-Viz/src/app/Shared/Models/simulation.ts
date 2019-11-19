import { AccessLevel } from '../Enums/access-level'
import { SimulationStatus } from '../Enums/simulation-status'
import { ChangedParameter } from './changed-parameter'
import { Format } from './format'
import { Identifier } from './identifier'
import { Model } from './model'
import { JournalReference } from './journal-reference';
import { Simulator } from './simulator'
import { Taxon } from './taxon'
import { User } from './user'
import { UtilsService } from '../Services/utils.service'

export class Simulation {
  id?: string;
  name?: string;
  description?: string;
  tags?: string[] = [];
  model?: Model;
  format?: Format;
  changedParameters?: ChangedParameter[] = [];
  length?: number;
  simulator?: Simulator;
  refs?: JournalReference[] = [];
  parent?: Simulation;
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
    refs?: JournalReference[],
    parent?: Simulation,
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
    this.accessToken = new UtilsService().genAccessToken();
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

  getAuthors(): string[] {
    const authors: string[] = [];
    for (const ref of this.refs) {
      Array.prototype.push.apply(authors, ref.authors);
    }
    return authors;
  }
}
