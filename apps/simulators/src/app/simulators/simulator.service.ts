import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Endpoints } from '@biosimulations/config/common';
import { map, shareReplay } from 'rxjs/operators';
//TODO set the api interface type
import { IImage, ISimulator } from '@biosimulations/datamodel/common';
import { UtilsService } from '@biosimulations/shared/angular';

export interface Version {
  version: string;
  created: Date;
  image: IImage | null;
  curationStatus: string;
  validated: boolean;
}

@Injectable({ providedIn: 'root' })
export class SimulatorService {
  private endpoints = new Endpoints();

  allSims = this.http
    .get<ISimulator[]>(this.endpoints.getSimulatorsEndpoint())
    .pipe(shareReplay(1));
  latestSims = this.http
    .get<ISimulator[]>(this.endpoints.getSimulatorsEndpoint('latest'))
    .pipe(shareReplay(1));

  getAll(): Observable<ISimulator[]> {
    return this.allSims;
  }

  getLatest(): Observable<ISimulator[]> {
    return this.latestSims;
  }

  getLatestById(id: string): Observable<ISimulator> {
    return this.getLatest().pipe(
      map((value: ISimulator[]) => {
        return value.filter((simulator: ISimulator) => simulator.id === id)[0];
      }),
    );
  }

  getOneByVersion(id: string, version: string): Observable<ISimulator> {
    return this.getAll().pipe(
      map((value: ISimulator[]) => {
        return value.filter(
          (simulator: ISimulator) =>
            simulator.id === id && simulator.version === version,
        )[0];
      }),
    );
  }

  getAllById(id: string): Observable<ISimulator[]> {
    return this.getAll().pipe(
      map((sims: ISimulator[]) => {
        return sims.filter((simulator: ISimulator) => simulator.id == id);
      }),
    );
  }

  getVersions(simId: string): Observable<Version[]> {
    return this.allSims.pipe(
      map((sims: ISimulator[]) => {
        const versions = [];
        for (const sim of sims) {
          if (sim.id === simId) {
            versions.push({
              version: sim.version,
              image: sim.image,
              created: sim.biosimulators.created,
              curationStatus: UtilsService.getSimulatorCurationStatusMessage(
                UtilsService.getSimulatorCurationStatus(sim),
                false,
              ),
              validated: sim.biosimulators.validated,
            });
          }
        }
        return versions;
      }),
    );
  }

  getValidationTestResultsForOneByVersion(
    id: string,
    version: string,
  ): Observable<ISimulator> {
    return this.http.get<ISimulator>(
      this.endpoints.getSimulatorsEndpoint(id, version, true),
    );
  }

  constructor(private http: HttpClient) {}
}
