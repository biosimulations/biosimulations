import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@biosimulations/shared/environments';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { urls } from '@biosimulations/config/common';
@Injectable({
  providedIn: 'root',
})
export class VisualizationService {
  tasksPerSedml: any;

  private resultsEndpoint = `${urls.dispatchApi}result`;
  constructor(private http: HttpClient) {}

  getVisualization(uuid: string, sedml: string, task: string) {
    // TODO: Save the data to localstorage, return from local storage if exists, if not return obeservable to request
    return this.http.get(
      `${this.resultsEndpoint}/${uuid}?chart=true&sedml=${sedml}&report=${task}`
    );
    // TODO: Update tasksPerSedml inside "tap" operator
  }

  getResultStructure(uuid: string) {
    return this.http.get(`${this.resultsEndpoint}/structure/${uuid}`);
  }
}
