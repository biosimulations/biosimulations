import { PersonInterface } from '../Models/person.interface';

export class UtilsService {

  static genAccessToken(length: number = 16): string {
      const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let result = '';
      for (let i: number = length; i > 0; --i) {
        result += chars[Math.floor(Math.random() * chars.length)];
      }
      return result;
  }

  static formatTimeForHumans(secs: number): string {
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

  static getPersonFullName(person: PersonInterface): string {
    const name: string[] = [];
    if (person.firstName) {
        name.push(person.firstName);
    }
    if (person.middleName) {
        name.push(person.middleName);
    }
    if (person.lastName) {
        name.push(person.lastName);
    }
    return name.join(' ');
  }
}
