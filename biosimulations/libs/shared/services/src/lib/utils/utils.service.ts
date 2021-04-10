import { BehaviorSubject, Observable, forkJoin, of } from 'rxjs';
import { SimulatorCurationStatus, ValueType } from '@biosimulations/datamodel/common';
// import { Simulator, Algorithm } from '@biosimulations/simulators/api-models';

export class UtilsService {
  static recursiveForkJoin(unresolvedData: any): Observable<any> {
    let resolvedData: any;
    const unresolvedDataToCheck: any[] = [];
    if (Array.isArray(unresolvedData)) {
      resolvedData = [];
      unresolvedData.forEach((val: any, key: number): void => {
        resolvedData.push(undefined);
        unresolvedDataToCheck.push({
          unresolvedParent: unresolvedData,
          resolvedParent: resolvedData,
          val,
          key,
        });
      });
    } else {
      resolvedData = {};
      Object.keys(unresolvedData).forEach((key: any): void => {
        resolvedData[key] = undefined;
        const val = unresolvedData[key];
        unresolvedDataToCheck.push({
          unresolvedParent: unresolvedData,
          resolvedParent: resolvedData,
          val,
          key,
        });
      });
    }

    const observablesToResolve: Observable<any>[] = [];
    const slotsForResolvedObservables: any[] = [];
    while (unresolvedDataToCheck.length) {
      const unresolvedDatum = unresolvedDataToCheck.pop();
      const unresolvedDatumVal = unresolvedDatum.val;

      if (unresolvedDatumVal instanceof Observable) {
        observablesToResolve.push(unresolvedDatumVal);
        slotsForResolvedObservables.push({
          parent: unresolvedDatum.resolvedParent,
          key: unresolvedDatum.key,
        });
      } else if (Array.isArray(unresolvedDatumVal)) {
        const resolvedDatumVal: any[] = [];
        unresolvedDatum.resolvedParent[unresolvedDatum.key] = resolvedDatumVal;
        unresolvedDatumVal.forEach((val: any, key: number): void => {
          resolvedDatumVal.push(undefined);
          unresolvedDataToCheck.push({
            unresolvedParent: unresolvedDatumVal,
            resolvedParent: resolvedDatumVal,
            val,
            key,
          });
        });
      } else if (
        unresolvedDatumVal != null &&
        (typeof unresolvedDatumVal === 'object' ||
          typeof unresolvedDatumVal === 'function') &&
        typeof unresolvedDatumVal.valueOf() === 'object'
      ) {
        const resolvedDatumVal: any = new unresolvedDatumVal.constructor();
        unresolvedDatum.resolvedParent[unresolvedDatum.key] = resolvedDatumVal;
        Object.keys(unresolvedDatumVal).forEach((key: any): void => {
          resolvedDatumVal[key] = undefined;
          const val = unresolvedDatumVal[key];
          unresolvedDataToCheck.push({
            unresolvedParent: unresolvedDatumVal,
            resolvedParent: resolvedDatumVal,
            val,
            key,
          });
        });
      } else {
        const resolvedDatumVal = unresolvedDatumVal;
        unresolvedDatum.resolvedParent[unresolvedDatum.key] = resolvedDatumVal;
      }
    }

    if (observablesToResolve.length) {
      const resolvedDataObservable = new BehaviorSubject(undefined);

      forkJoin(observablesToResolve).subscribe((resolvedVals: any[]): void => {
        resolvedVals.forEach((val: any, iVal: number): void => {
          const parent = slotsForResolvedObservables[iVal].parent;
          const key = slotsForResolvedObservables[iVal].key;
          parent[key] = val;
        });
        resolvedDataObservable.next(resolvedData);
      });
      return resolvedDataObservable.asObservable();
    } else {
      return of(resolvedData);
    }
  }

  static getSimulatorCurationStatus(simulator: any): SimulatorCurationStatus {
    // true type of simulator: Simulator
    let curationStatus =
      SimulatorCurationStatus['Registered with BioSimulators'];
    if (simulator.algorithms.length > 0) {
      curationStatus = SimulatorCurationStatus['Algorithms curated'];

      let parametersCurated = true;
      simulator.algorithms.forEach((algorithm: any): void => {
        // true type of algorithm: Algorithm
        if (algorithm.parameters == null) {
          parametersCurated = false;
        }
      });

      if (parametersCurated) {
        curationStatus = SimulatorCurationStatus['Parameters curated'];

        if (simulator.image) {
          curationStatus = SimulatorCurationStatus['Image available'];

          if (simulator?.biosimulators?.validated) {
            curationStatus = SimulatorCurationStatus['Image validated'];
          }
        }
      }
    }

    return curationStatus;
  }

  static getSimulatorCurationStatusMessage(
    status: SimulatorCurationStatus,
    showLabel = true,
  ): string {
    let label = '';
    if (showLabel) {
      for (const [key, val] of Object.entries(SimulatorCurationStatus)) {
        if (typeof key === 'string' && val === status) {
          label = ' ' + (key as string);
          break;
        }
      }
    }
    return (
      '★'.repeat(status) +
      '☆'.repeat(SimulatorCurationStatus['Image validated'] - status) +
      label
    );
  }

  static parseValue<T>(
    getKisaoTermName: (id: string) => T,
    type: string,
    val: string | null,
  ): boolean | number | string | T | null {
    if (val == null || val === '') {
      return null;
    } else {
      if (type === ValueType.kisaoId) {
        return getKisaoTermName(val);
      } else if (type === ValueType.boolean) {
        return ['1', 'true'].includes(val.toLowerCase());
      } else if (type === ValueType.integer) {
        return parseInt(val);
      } else if (type === ValueType.float) {
        return parseFloat(val);
      } else {
        return val;
      }
    }
  }

  static formatValue(
    type: ValueType,
    value: boolean | number | string | null,
  ): string | null {
    if (value == null) {
      return value;
    } else if (type === ValueType.boolean) {
      return value.toString();
    } else if (type === ValueType.integer || type === ValueType.float) {
      if (value === 0) {
        return '0';
      } else if (value < 1e-3 || value > 1e3) {
        const exp = Math.floor(Math.log10(value as number));
        const val = (value as number) / Math.pow(10, exp);
        let valStr: string;
        if (Math.abs((val * 1 - Math.round(val * 1)) / (val * 1)) < 1e-12) {
          valStr = val.toFixed(0);
        } else if (
          Math.abs((val * 1e1 - Math.round(val * 1e1)) / (val * 1e1)) < 1e-12
        ) {
          valStr = val.toFixed(1);
        } else if (
          Math.abs((val * 1e2 - Math.round(val * 1e2)) / (val * 1e2)) < 1e-12
        ) {
          valStr = val.toFixed(2);
        } else {
          valStr = val.toFixed(3);
        }
        return `${valStr}e${exp}`;
      } else {
        return value.toString();
      }
    } else {
      return value as string;
    }
  }

  static validateValue(value: string, type: ValueType, isKisaoId: (id: string) => boolean): boolean {
    let parsedValue: any;
    switch (type) {
      case ValueType.boolean: {
        return ['true', 'false', '1', '0'].includes(value.toLowerCase());
      }
      case ValueType.integer: {
        parsedValue = parseInt(value);
        return !isNaN(parsedValue) && parsedValue === parseFloat(value);
      }
      case ValueType.float: {
        return !isNaN(parseFloat(value));
      }
      case ValueType.string: {
        return true;
      }
      case ValueType.kisaoId: {
        return isKisaoId(value);
      }
      case ValueType.list: {
        try {
          return Array.isArray(JSON.parse(value));
        } catch {
          return false;
        }
      }
      case ValueType.object: {
        try {
          parsedValue = JSON.parse(value);
          return (
            parsedValue != null &&
            typeof parsedValue !== 'string' &&
            typeof parsedValue !== 'number' &&
            !Array.isArray(parsedValue)
          );
        } catch {
          return false;
        }
      }
      case ValueType.any: {
        try {
          JSON.parse(value);
          return true;
        } catch {
          return false;
        }
      }
      default: {
        throw new Error(`type '${type}' is not supported`);
      }
    }
  }

  static getFileExtension(filename: string): string {
    return filename.slice((Math.max(0, filename.lastIndexOf(".")) || Infinity) + 1);
  }
}
