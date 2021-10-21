import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { urls } from '@biosimulations/config/common';
import { map, shareReplay } from 'rxjs/operators';
//TODO set the api interface type
import { IImage } from '@biosimulations/datamodel/common';
import { Simulator } from '@biosimulations/datamodel/api';
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
      }),
    );
  }

  getOneByVersion(id: string, version: string): Observable<Simulator> {
    return this.getAll().pipe(
      map((value: Simulator[]) => {
        return value.filter(
          (simulator: Simulator) =>
            simulator.id === id && simulator.version === version,
        )[0];
      }),
    );
  }

  getAllById(id: string): Observable<Simulator[]> {
    return this.getAll().pipe(
      map((sims: Simulator[]) => {
        return sims.filter((simulator: Simulator) => simulator.id == id);
      }),
    );
  }

  getVersions(simId: string): Observable<Version[]> {
    return this.allSims.pipe(
      map((sims: Simulator[]) => {
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
  ): Observable<Simulator> {
    return this.http.get<Simulator>(this.endpoint + id + '/' + version, {
      params: { includeTests: true },
    });
  }

  constructor(private http: HttpClient) {}
}
