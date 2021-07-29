import { BehaviorSubject, Observable, forkJoin, of } from 'rxjs';
import { SimulatorCurationStatus } from '@biosimulations/datamodel/common';
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
}
