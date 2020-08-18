import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VisualisationService {

  
  tasksPerSedml: any;
  updateDataEvent = new Subject<any>();

  private resultsEndpoint = `${environment.crbm.DISPATCH_API_URL}/result`;
  constructor(private http: HttpClient) { }

  getVisualisation(uuid: string) {
    // TODO: Save the data to localstorage, return from local storage if exists, if not return obeservable to request
    return this.http.get(`${this.resultsEndpoint}/${uuid}?chart=true`);
    // TODO: Update tasksPerSedml inside "tap" operator
  }

 
}
