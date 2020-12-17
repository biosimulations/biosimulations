import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@biosimulations/shared/environments';
import { Subject, Observable } from 'rxjs';
import { urls } from '@biosimulations/config/common';
import { map } from 'rxjs/operators';
import {
  SimulationRun,
  UploadSimulationRun,
} from '@biosimulations/dispatch/api-models';
@Injectable({
  providedIn: 'root',
})
export class DispatchService {
  uuidUpdateEvent = new Subject<string>();
  uuidsDispatched: Array<string> = [];

  submitJob(
    fileToUpload: File,
    selectedSimulator: string,
    selectedVersion: string,
    name: string,
    email: string
  ): Observable<SimulationRun> {
    const endpoint = `${urls.dispatchApi}run/`;

    const formData = new FormData();

    const run: UploadSimulationRun = {
      name: name,
      email: email || null,
      simulator: selectedSimulator,
      simulatorVersion: selectedVersion,
    };
    formData.append('file', fileToUpload, fileToUpload.name);
    formData.append('simulationRun', JSON.stringify(run));

    const response = this.http.post(endpoint, formData) as Observable<
      SimulationRun
    >;
    return response;
  }

  getAllSimulatorInfo(simulatorName?: string): Observable<string[]> {
    const endpoint = `${urls.dispatchApi}simulators`;
    if (simulatorName === undefined) {
      return this.http.get(endpoint) as Observable<string[]>;
    }
    return this.http.get(`${endpoint}?name=${simulatorName}`) as Observable<
      string[]
    >;
  }

  getSimulatorsFromDb() {
    const endpoint = `https://api.biosimulators.org/simulators`;

    return this.http.get(endpoint).pipe(
      map((response: any) => {
        // response to dict logic
        const simulatorsInfo: {[id: string]: string[]} = {};

        for (const simulator of response) {
          if (simulator?.image && simulator?.biosimulators?.validated) {
            if (!(simulator.id in simulatorsInfo)) {
              simulatorsInfo[simulator.id] = [];
            }
            simulatorsInfo[simulator.id].push(simulator.version);
          }
        }

        for (const versions of Object.values(simulatorsInfo)) {
          versions
            .sort((a: string, b: string): number => {
              return a.localeCompare(b, undefined, { numeric: true });
            })
            .reverse();
        }

        return simulatorsInfo;
      })
    );
  }

  getSimulationLogs(uuid: string) {
    const endpoint = `${urls.dispatchApi}logs/${uuid}?download=false`;
    return this.http.get(endpoint);
  }

  constructor(private http: HttpClient) {}
}
