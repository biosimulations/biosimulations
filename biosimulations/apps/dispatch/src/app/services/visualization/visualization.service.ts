import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { urls } from '@biosimulations/config/common';

interface TaskMap {
  [key: string]: string[];
}

@Injectable({
  providedIn: 'root'
})
export class VisualizationService {
  private resultsEndpoint = `${urls.dispatchApi}results`;
  constructor(private http: HttpClient) {}

  getReport(uuid: string, sedml: string, report: string) {
    report = encodeURIComponent(sedml + '/' + report);
    // TODO: Save the data to localstorage, return from local storage if exists, if not return obeservable to request
    return this.http
      .get(`${this.resultsEndpoint}/${uuid}/${report}?sparse=false`)
      .pipe(map((x: any) => x.data));
  }

  getResultStructure(uuid: string) {
    return this.http.get(`${this.resultsEndpoint}/${uuid}?sparse=true`).pipe(
      //tap((x) => console.log(x)),
      map((result: any) => result.reports),
      map((array: { [key: string]: string }[]): TaskMap => {
        const taskNames: string[] = [];
        const taskMap: TaskMap = {};
        array.forEach((item) => {
          taskNames.push(item.reportId);
        });

        taskNames.forEach((task: string) => {
          const report = task.split('/').reverse()[0];
          const sedMl = task.split('/').reverse().slice(1).reverse().join('/');

          if (Object.keys(taskMap).includes(sedMl)) {
            taskMap[sedMl].push(report);
          } else {
            taskMap[sedMl] = [];
            taskMap[sedMl].push(report);
          }
        });

        return taskMap;
      }),
      catchError((error: HttpErrorResponse): Observable<TaskMap> => {
        if (error instanceof HttpErrorResponse && error.status === 404) {
          const taskMap: TaskMap = {};
          return of<TaskMap>(taskMap);
        } else {
          throw error;
        }
      }),      
    );
  }
}
