import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'apps/biosimulations-dispatch-frontend/src/environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VisualisationService {

  uuidUpdateEvent = new Subject<Array<string>>();
  uuidsFetched: Array<string> = [];
  tasksPerSedml: any;

  private resultsEndpoint = `${environment.crbm.DISPATCH_API_URL}/result`;
  constructor(private http: HttpClient) { }

  getVisualisation(uuid: string) {
    this.uuidsFetched.push(uuid);
    this.uuidUpdateEvent.next(this.uuidsFetched);
    // TODO: Save the data to localstorage, return from local storage if exists, if not return obeservable to request
    return this.http.get(`${this.resultsEndpoint}/${uuid}?chart=true`);
    // TODO: Update tasksPerSedml inside "tap" operator
  }
}
