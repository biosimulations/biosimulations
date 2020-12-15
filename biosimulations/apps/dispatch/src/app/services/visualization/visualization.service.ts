import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@biosimulations/shared/environments';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { urls } from '@biosimulations/config/common';
@Injectable({
  providedIn: 'root'
})
export class VisualizationService {
  private resultsEndpoint = `${urls.dispatchApi}results`;
  constructor(private http: HttpClient) {}

  getReport(uuid: string, sedml: string, report: string) {
    // TODO: Save the data to localstorage, return from local storage if exists, if not return obeservable to request
    return this.http.get(
      `${this.resultsEndpoint}/${uuid}?chart=true&sedml=${sedml}&report=${report}`
    );
  }

  /* @TODO The api does not keep track of higher level sedml file
   *  @jonrkarr The api is setting an ID for each report produced, witouth keeeping track of the sedml file that it is from. The design chart form is expecting a top level sedml file name, and then names for each task under that. Should I change the api? *
   */
  getResultStructure(uuid: string) {
    return this.http.get(`${this.resultsEndpoint}/${uuid}?sparse=true`).pipe(
      //tap((x) => console.log(x)),
      map((result: any) => result.reports),
      map((array: { [key: string]: string }[]) => {
        const taskNames: string[] = [];
        array.forEach((item) => {
          taskNames.push(item.reportId);
        });
        return { simulation: taskNames };
      })
    );
  }
}
