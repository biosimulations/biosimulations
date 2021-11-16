import { Injectable } from '@angular/core';
import { Observable, shareReplay, map } from 'rxjs';
import {
  SimulatorIdNameMap,
  ISimulator,
} from '@biosimulations/datamodel/common';
import { HttpClient } from '@angular/common/http';
import { Endpoints } from '@biosimulations/config/common';

@Injectable({
  providedIn: 'root',
})
export class SimulatorService {
  private endpoints = new Endpoints();
  constructor(private http: HttpClient) {}

  public getSimulatorIdNameMap(): Observable<SimulatorIdNameMap> {
    const endpoint = this.endpoints.getSimulatorsEndpoint(undefined, 'latest');
    return this.http.get<ISimulator[]>(endpoint).pipe(
      map((simulators: ISimulator[]): SimulatorIdNameMap => {
        const idNameMap: SimulatorIdNameMap = {};
        simulators.forEach((simulator: ISimulator): void => {
          idNameMap[simulator.id] = simulator.name;
        });
        return idNameMap;
      }),
      shareReplay(1),
    );
  }
}
