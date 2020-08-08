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

  private resultsEndpoint = `${environment.crbm.DISPATCH_API_URL}/result`;
  constructor(private http: HttpClient) { }

  getVisualisation(uuid: string) {
    this.uuidsFetched.push(uuid);
    this.uuidUpdateEvent.next(this.uuidsFetched);
    return this.http.get(`${this.resultsEndpoint}/${uuid}?chart=true`);
  }
}
