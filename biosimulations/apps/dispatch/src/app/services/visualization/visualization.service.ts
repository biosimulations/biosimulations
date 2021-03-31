import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { urls } from '@biosimulations/config/common';
import { TaskMap } from '../../datamodel';
import {
  SimulationRunReport,
  SimulationRunResults,
  SimulationRunReportDatum,
} from '@biosimulations/dispatch/api-models';

@Injectable({
  providedIn: 'root',
})
export class VisualizationService {
  private resultsEndpoint = `${urls.dispatchApi}results`;
  public constructor(private http: HttpClient) {}

  public getReport(
    uuid: string,
    sedml: string,
    report: string,
  ): Observable<SimulationRunReportDatum[]> {
    report = encodeURIComponent(sedml + '/' + report);
    // TODO: Save the data to localstorage, return from local storage if exists, if not return obeservable to request
    return this.http
      .get<SimulationRunReport>(
        `${this.resultsEndpoint}/${uuid}/${report}?sparse=false`,
      )
      .pipe(map((x) => x.data));
  }

  public getResultStructure(uuid: string): Observable<TaskMap> {
    return this.http
      .get<SimulationRunResults>(`${this.resultsEndpoint}/${uuid}?sparse=true`)
      .pipe(
        map((result: SimulationRunResults) => result.reports),
        map(
          (reports: SimulationRunReport[]): TaskMap => {
            const taskNames: string[] = [];
            const taskMap: TaskMap = {};
            reports.forEach((item) => {
              taskNames.push(item.reportId);
            });

            taskNames.forEach((task: string) => {
              const report = task.split('/').reverse()[0];
              const sedMl = task
                .split('/')
                .reverse()
                .slice(1)
                .reverse()
                .join('/');

              if (Object.keys(taskMap).includes(sedMl)) {
                taskMap[sedMl].push(report);
              } else {
                taskMap[sedMl] = [];
                taskMap[sedMl].push(report);
              }
            });

            return taskMap;
          },
        ),
        catchError(
          (error: HttpErrorResponse): Observable<TaskMap> => {
            if (error instanceof HttpErrorResponse && error.status === 404) {
              const taskMap: TaskMap = {};
              return of<TaskMap>(taskMap);
            } else {
              throw error;
            }
          },
        ),
      );
  }
}
