import { BehaviorSubject, Observable, forkJoin, of } from 'rxjs';
import { SimulatorCurationStatus } from '@biosimulations/datamodel/common';
// import { Simulator, Algorithm } from '@biosimulations/datamodel/api';

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

  static getDateString(value: Date): string {
    return (
      value.getFullYear() +
      '-' +
      ('0' + (value.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + value.getDate()).slice(-2)
    );
  }

  static getDateTimeString(value: Date): string {
    return (
      value.getFullYear().toString() +
      '-' +
      (value.getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      value.getDate().toString().padStart(2, '0') +
      ' ' +
      (((value.getHours() - 1) % 12) + 1).toString().padStart(2, '0') +
      ':' +
      value.getMinutes().toString().padStart(2, '0') +
      ':' +
      value.getSeconds().toString().padStart(2, '0') +
      ' ' +
      (value.getHours() <= 11 ? 'AM' : 'PM')
    );
  }

  static formatNumberOfOrderUnity(value: number, digits=2): string {
    if (value === Math.round(value)) {
      return Math.round(value).toString();
    } else {
      return value.toFixed(digits);
    }
  }

  static formatDuration(
    valueSec: number | null | undefined,
    nullFormattedValue: string | null = null,
  ): string | null {
    if (valueSec == null || valueSec === undefined) {
      return nullFormattedValue;
    }

    if (valueSec >= 7 * 24 * 60 * 60) {
      return (valueSec / (7 * 24 * 60 * 60)).toFixed(1) + ' w';
    } else if (valueSec >= 24 * 60 * 60) {
      return (valueSec / (24 * 60 * 60)).toFixed(1) + ' d';
    } else if (valueSec >= 60 * 60) {
      return (valueSec / (60 * 60)).toFixed(1) + ' h';
    } else if (valueSec >= 60) {
      return (valueSec / 60).toFixed(1) + ' m';
    } else if (valueSec >= 1) {
      return valueSec.toFixed(1) + ' s';
    } else {
      return (valueSec * 1000).toFixed(1) + ' ms';
    }
  }

  static formatDigitalSize(valueBytes: number): string {
    let quantity!: number;
    let suffix!: string;

    if (valueBytes >= 1e15) {
      quantity = valueBytes * 1e-15;
      suffix = 'PB';

    } else if (valueBytes >= 1e12) {
      quantity = valueBytes * 1e-12;
      suffix = 'TB';

    } else if (valueBytes >= 1e9) {
      quantity = valueBytes * 1e-9;
      suffix = 'GB';

    } else if (valueBytes >= 1e6) {
      quantity = valueBytes * 1e-6;
      suffix = 'MB';
      
    } else if (valueBytes >= 1e3) {
      quantity = valueBytes * 1e-3;
      suffix = 'KB';

    } else {
      quantity = valueBytes * 1e-15;
      suffix = 'B';
    }

    let quantityStr!: string;

    if (quantity === Math.round(quantity)) {
      quantityStr = Math.round(quantity).toString();
    } else if (quantity >= 100) {
      quantityStr = quantity.toFixed(1);
    } else if (quantity >= 10) {
      quantityStr = quantity.toFixed(2);
    } else {
      quantityStr = quantity.toFixed(3);
    }

    return quantityStr + ' ' + suffix;
  }
}
