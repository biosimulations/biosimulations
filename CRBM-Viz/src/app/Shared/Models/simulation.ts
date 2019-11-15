import { AccessLevel } from '../Enums/access-level'
import { SimulationStatus } from '../Enums/simulation-status'
import { Format } from './format'
import { Identifier } from './identifier'
import { Model } from './model'
import { Taxon } from './taxon'
import { User } from './user'

export class Simulation {
  id: string;
  name: string;
  tags: string[];
  model: Model;
  format: Format;
  length: number;
  simulator: Format;
  author: User;
  access: AccessLevel;
  status: SimulationStatus;
  date: Date;

  constructor(
    id?: string,
    name?: string,
    tags?: string[],
    model?: Model,
    format?: Format,
    length?: number,
    simulator?: Format,
    author?: User,
    access?: AccessLevel,
    status?: SimulationStatus,
    date?: Date,
    ) {
    this.id = id;
    this.name = name;
    this.tags = tags;
    this.model = model;
    this.format = format;
    this.length = length;
    this.simulator = simulator;
    this.author = author;
    this.access = access;
    this.status = status;
    this.date = date;
  }

  static getHumanReadableTime(secs: number): string {
    let numerator:number;
    let units:string;

    if (secs >= 1) {
      if (secs >= 60) {
        if (secs >= 60 * 60) {
          if (secs >= 60 * 60 * 24) {
            if (secs >= 60 * 60 * 24 * 365) {
              numerator = 60 * 60 * 24 * 365;
              units = 'y';
            } else {
              numerator = 60 * 60 * 24;
              units = 'd';
            }
          } else {
            numerator = 60 * 60;
            units = 'h';
          }
        } else {
          numerator = 60;
          units = 'm';
        }
      } else {
        numerator = 1;
        units = 's';
      }
    } else if (secs >= 1e-3) {
      numerator = 1e-3;
      units = 'ms';
    } else if (secs >= 1e-6) {
      numerator = 1e-6;
      units = 'us';
    } else if (secs >= 1e-9) {
      numerator = 1e-9;
      units = 'ns';
    } else if (secs >= 1e-12) {
      numerator = 1e-12;
      units = 'ps';
    } else if (secs >= 1e-15) {
      numerator = 1e-15;
      units = 'fs';
    } else if (secs >= 1e-18) {
      numerator = 1e-18;
      units = 'as';
    } else if (secs >= 1e-21) {
      numerator = 1e-21;
      units = 'zs';
    } else {
      numerator = 1e-24;
      units = 'ys';
    }
    return Math.round(secs / numerator) + ' ' + units;
  }

  getRoute() {
    return ['/simulate', this.id];
  }
}
