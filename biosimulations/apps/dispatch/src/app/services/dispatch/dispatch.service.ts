import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@biosimulations/shared/environments';
import { Subject, Observable } from 'rxjs';
import { urls } from '@biosimulations/config/common';
import { map } from 'rxjs/operators';
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
  ) {
    const endpoint = `${urls.dispatchApi}dispatch`;

    // TODO: Create a datamodel to hold the schema for simulation spec for frontend
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    formData.append('simulator', selectedSimulator);
    formData.append('simulatorVersion', selectedVersion);
    formData.append('email', email);
    formData.append('name', name);
    return this.http.post(endpoint, formData);
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
        const simulatorsInfo: any = {};
        const simualtorsList: any = [];
        const data = response;

        // this.logger.debug(data[2]['version']);
        for (let index = 0; index < data.length; index++) {
          simualtorsList.push(data[index]['id']);
        }

        for (let index = 0; index < simualtorsList.length; index++) {
          if (simulatorsInfo[simualtorsList[index]] !== undefined) {
            simulatorsInfo[simualtorsList[index]].push(data[index]['version']);
          } else {
            simulatorsInfo[simualtorsList[index]] = [data[index]['version']];
          }
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
