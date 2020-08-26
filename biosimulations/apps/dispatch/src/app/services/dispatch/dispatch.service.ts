import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DispatchService {
  uuidUpdateEvent = new Subject<string>();
  uuidsDispatched: Array<string> = [];

  submitJob(
    fileToUpload: File,
    selectedSimulator: string,
    selectedVersion: string
  ) {
    // TODO: Take the endpoints from urls.ts shared libs
    const endpoint = `${environment.crbm.DISPATCH_API_URL}/dispatch`;

    // TODO: Create a datamodel to hold the schema for simulation spec for frontend
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    formData.append('simulator', selectedSimulator);
    formData.append('simulatorVersion', selectedVersion);
    console.log(formData);
    return this.http.post(endpoint, formData);
  }

  getAllSimulatorInfo(simulatorName?: string) {
    const endpoint = `${environment.crbm.DISPATCH_API_URL}/simulators`;
    if (simulatorName === undefined) {
      return this.http.get(endpoint);
    }
    return this.http.get(`${endpoint}?name=${simulatorName}`);
  }

  constructor(private http: HttpClient) {}
}
