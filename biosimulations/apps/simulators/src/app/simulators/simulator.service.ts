import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { urls } from '@biosimulations/config/common';
import { map, pluck, shareReplay } from 'rxjs/operators';
//TODO set the api interface type
import { Simulator } from '@biosimulations/simulators/api-models';
@Injectable({ providedIn: 'root' })
export class SimulatorService {
  endpoint = urls.simulatorsApi + 'simulators/';
  allSims = this.http.get<Simulator[]>(this.endpoint).pipe(shareReplay(1));
  latestSims = this.http
    .get<Simulator[]>(this.endpoint + 'latest')
    .pipe(shareReplay(1));

  getAll(): Observable<Simulator[]> {
    return this.allSims;
  }
  getLatest(): Observable<Simulator[]> {
    return this.latestSims;
  }

  getLatestById(id: string): Observable<Simulator> {
    return this.getLatest().pipe(
      map((value: Simulator[]) => {
        return value.filter((simulator: Simulator) => simulator.id === id)[0];
      })
    );
  }
  getOneByVersion(id: string, version: string) {
    return this.getAll().pipe(
      map((value: Simulator[]) => {
        return value.filter(
          (simulator: Simulator) =>
            simulator.id === id && simulator.version === version
        )[0];
      })
    );
  }
  getAllById(id: string): Observable<Simulator[]> {
    return this.getAll().pipe(
      map((sims: Simulator[]) => {
        return sims.filter((simulator: Simulator) => simulator.id == id);
      })
    );
  }

  getVersions(simId: string): Observable<string[]> {
    return this.allSims.pipe(
      map((sims: Simulator[]) => {
        const versions = [];
        for (const sim of sims) {
          if (sim.id === simId) {
            versions.push(sim.version);
          }
        }
        return versions;
      })
    );
  }
  constructor(private http: HttpClient) {}
}
