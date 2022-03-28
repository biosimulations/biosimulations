import { Injectable } from '@angular/core';
import { DispatchService, CombineApiService, SimulatorsData } from '../../index';
import { AlgorithmSubstitution } from '@biosimulations/datamodel/common';
import { concatMap, map } from 'rxjs/operators';
import { Observable, zip } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface SimulationProjectUtilData {
  algorithmSubstitutions: AlgorithmSubstitution[];
  simulators: SimulatorsData;
  params: Params;
}

@Injectable({
  providedIn: 'root',
})
export class SimulationProjectUtilLoaderService {
  public constructor(
    private dispatchService: DispatchService,
    private combineApiService: CombineApiService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) {}

  public loadSimulationUtilData(): Observable<SimulationProjectUtilData> {
    const simulatorsDataObs = this.dispatchService.getSimulatorsFromDb();
    const algSubObs = simulatorsDataObs.pipe(concatMap(this.getAlgSubs.bind(this)));
    const loadCompleteObs = zip([algSubObs, simulatorsDataObs, this.route.queryParams]);
    return loadCompleteObs.pipe(map(this.prepareData.bind(this)));
  }

  private prepareData(data: [AlgorithmSubstitution[] | undefined, SimulatorsData, Params]): SimulationProjectUtilData {
    const algSubstitutions = data[0] === undefined ? [] : data[0];
    if (algSubstitutions.length === 0) {
      this.showAlgorithmSubstitutionErrorSnackbar();
    }
    return {
      algorithmSubstitutions: algSubstitutions,
      simulators: data[1],
      params: data[2],
    };
  }

  private getAlgSubs(simulatorsData: SimulatorsData): Observable<AlgorithmSubstitution[] | undefined> {
    const algorithmKeys = Object.keys(simulatorsData.simulationAlgorithms);
    return this.combineApiService.getSimilarAlgorithms(algorithmKeys);
  }

  private showAlgorithmSubstitutionErrorSnackbar(): void {
    this.snackBar.open(
      'Sorry! We were unable to load information about the simularity among algorithms. Please refresh to try again.',
      'Ok',
      {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      },
    );
  }
}
