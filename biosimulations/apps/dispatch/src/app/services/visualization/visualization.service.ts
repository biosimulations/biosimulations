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
    report = encodeURIComponent(sedml + '/' + report);
    // TODO: Save the data to localstorage, return from local storage if exists, if not return obeservable to request
    return this.http
      .get(`${this.resultsEndpoint}/${uuid}/${report}?sparse=false`)
      .pipe(
        tap((x) => console.log(x)),
        map((x: any) => x.data)
      );
  }

  getResultStructure(uuid: string) {
    return this.http.get(`${this.resultsEndpoint}/${uuid}?sparse=true`).pipe(
      //tap((x) => console.log(x)),
      map((result: any) => result.reports),
      map((array: { [key: string]: string }[]) => {
        const taskNames: string[] = [];
        const taskMap: { [key: string]: string[] } = {};
        array.forEach((item) => {
          taskNames.push(item.reportId);
        });

        taskNames.forEach((task: string) => {
          const report = task.split('/').reverse()[0];
          const sedMl = task.split('/').reverse().slice(1).reverse().join('/');
          console.log(report);
          console.log(sedMl);
          if (Object.keys(taskMap).includes(sedMl)) {
            taskMap[sedMl].push(report);
          } else {
            taskMap[sedMl] = [];
            taskMap[sedMl].push(report);
          }
        });

        return taskMap;
      })
    );
  }
}
