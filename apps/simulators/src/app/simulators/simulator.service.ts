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

  private allSims = this.http
    .get<ISimulator[]>(this.endpoints.getSimulatorsEndpoint(false))
    .pipe(shareReplay(1));
  private latestSims = this.http
    .get<ISimulator[]>(this.endpoints.getLatestSimulatorsEndpoint(false))
    .pipe(shareReplay(1));

  public getAll(): Observable<ISimulator[]> {
    return this.allSims;
  }

  public getLatest(): Observable<ISimulator[]> {
    return this.latestSims;
  }

  public getLatestById(id: string): Observable<ISimulator> {
    return this.getLatest().pipe(
      map((value: ISimulator[]) => {
        return value.filter((simulator: ISimulator) => simulator.id === id)[0];
      }),
    );
  }

  public getOneByVersion(id: string, version: string): Observable<ISimulator> {
    return this.getAll().pipe(
      map((value: ISimulator[]) => {
        return value.filter(
          (simulator: ISimulator) =>
            simulator.id === id && simulator.version === version,
        )[0];
      }),
    );
  }

  public getAllById(id: string): Observable<ISimulator[]> {
    return this.getAll().pipe(
      map((simulators: ISimulator[]) => {
        return simulators.filter((simulator: ISimulator) => simulator.id == id);
      }),
    );
  }

  public getVersions(simulatorId: string): Observable<Version[]> {
    return this.allSims.pipe(
      map((simulators: ISimulator[]) => {
        const versions = [];
        for (const simulator of simulators) {
          if (simulator.id === simulatorId) {
            versions.push({
              version: simulator.version,
              image: simulator.image,
              created: simulator.biosimulators.created,
              curationStatus: UtilsService.getSimulatorCurationStatusMessage(
                UtilsService.getSimulatorCurationStatus(simulator),
                false,
              ),
              validated: simulator.biosimulators.validated,
            });
          }
        }
        return versions;
      }),
    );
  }

  public getValidationTestResultsForOneByVersion(
    id: string,
    version: string,
  ): Observable<ISimulator> {
    return this.http.get<ISimulator>(
      this.endpoints.getSimulatorsEndpoint(false, id, version, true),
    );
  }

  public constructor(private http: HttpClient) {}
}
