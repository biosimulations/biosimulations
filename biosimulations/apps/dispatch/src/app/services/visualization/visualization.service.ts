import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { urls } from '@biosimulations/config/common';
import {
  CombineResults,
  SedDocumentResults,
  SedReportResults,
  SedDatasetResults,
} from '../../datamodel';

@Injectable({
  providedIn: 'root',
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

  getResults(uuid: string, sparse=true): Observable<CombineResults> {
    return this.http.get(`${this.resultsEndpoint}/${uuid}?sparse=${sparse}`).pipe(
      // tap((x) => console.log(x)),
      map((result: any) => result.reports),
      map(
        (reports: any[]): CombineResults => {
          const structureObject: any = {};
          reports.forEach((report: any): void => {
            const sedmlLocationReportId = report.reportId;
            const sedmlLocation = sedmlLocationReportId
              .split('/')
              .reverse()
              .slice(1)
              .reverse()
              .join('/');
            const reportId = sedmlLocationReportId.split('/').reverse()[0];

            if (!structureObject?.[sedmlLocation]) {
              structureObject[sedmlLocation] = {}
            }
            const datasetLabels = Object.keys(report.data);
            datasetLabels.sort((a: string, b: string): number => {
              return a.localeCompare(b, undefined, { numeric: true });
            });
            structureObject[sedmlLocation][reportId] = datasetLabels.map((datasetLabel: string): SedDatasetResults => {
              return {
                _id: sedmlLocation + '/' + reportId + '/' + datasetLabel,
                location: undefined,
                reportId: undefined,
                label: datasetLabel,
                value: report.data[datasetLabel],
              };
            })
          });

          const sedmlLocations = Object.keys(structureObject);
          sedmlLocations.sort((a: string, b: string): number => {
            return a.localeCompare(b, undefined, { numeric: true });
          });
          const structureArray = sedmlLocations.map((sedmlLocation: string): SedDocumentResults => {
            const reportIds = Object.keys(structureObject[sedmlLocation]);
            reportIds.sort((a: string, b: string): number => {
              return a.localeCompare(b, undefined, { numeric: true });
            });
            return {
              location: sedmlLocation,
              reports: reportIds.map((reportId: string): SedReportResults => {
                return {
                  id: reportId,
                  datasets: structureObject[sedmlLocation][reportId],
                };
              }),
            };
          });
          return structureArray;
        }
      ),
      catchError(
        (error: HttpErrorResponse): Observable<CombineResults> => {
          if (error instanceof HttpErrorResponse && error.status === 404) {
            const resultsStructure: CombineResults = [];
            return of<CombineResults>(resultsStructure);
          } else {
            throw error;
          }
        },
      ),
    );
  }
}
