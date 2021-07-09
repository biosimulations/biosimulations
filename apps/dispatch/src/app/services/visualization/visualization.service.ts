import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError, timer } from 'rxjs';
import { map, catchError, retryWhen, mergeMap } from 'rxjs/operators';
import { urls } from '@biosimulations/config/common';
import {
  CombineResults,
  SedDocumentResults,
  SedReportResults,
  SedDatasetResults,
  SedDatasetResultsMap,
} from '../../datamodel';
import { CombineArchive } from '../../combine-sedml.interface';

import {
  SimulationRunOutput,
  SimulationRunResults,
  SimulationRunOutputDatum,
} from '@biosimulations/dispatch/api-models';
import { environment } from '@biosimulations/shared/environments';
import { CombineService } from '../combine/combine.service';

@Injectable({
  providedIn: 'root',
})
export class VisualizationService {
  private combineArchiveEndpoint = `${urls.dispatchApi}run/`;
  private resultsEndpoint = `${urls.dispatchApi}results`;
  public constructor(
    private http: HttpClient,
    private combineService: CombineService,
  ) {}

  public getCombineResultsStructure(
    uuid: string,
    sparse = true,
  ): Observable<CombineResults | undefined> {
    const retryStrategy = new RetryStrategy();
    return this.http
      .get<SimulationRunResults>(
        // TODO Remove hardocoded string. Caused #2635
        `${this.resultsEndpoint}/${uuid}?includeData=${!sparse}`,
      )
      .pipe(
        retryWhen(retryStrategy.handler.bind(retryStrategy)),
        map(
          (result: SimulationRunResults): SimulationRunOutput[] =>
            result.outputs,
        ),
        map((reports: SimulationRunOutput[]): CombineResults => {
          const structureObject: any = {};
          reports.forEach((report: SimulationRunOutput): void => {
            const sedmlLocationReportId = report.outputId;
            const sedmlLocation = sedmlLocationReportId
              .split('/')
              .reverse()
              .slice(1)
              .reverse()
              .join('/');
            const reportId = sedmlLocationReportId.split('/').reverse()[0];

            if (!structureObject?.[sedmlLocation]) {
              structureObject[sedmlLocation] = {};
            }

            structureObject[sedmlLocation][reportId] = report.data.map(
              (datum: SimulationRunOutputDatum): SedDatasetResults => {
                return {
                  uri: sedmlLocation + '/' + reportId + '/' + datum.id,
                  id: datum.id,
                  location: sedmlLocation,
                  reportId: reportId,
                  label: datum.label,
                  values: datum.values,
                };
              },
            );
          });

          const sedmlLocations = Object.keys(structureObject);
          sedmlLocations.sort((a: string, b: string): number => {
            return a.localeCompare(b, undefined, { numeric: true });
          });
          const structureArray = sedmlLocations.map(
            (sedmlLocation: string): SedDocumentResults => {
              const reportIds = Object.keys(structureObject[sedmlLocation]);
              return {
                uri: sedmlLocation,
                location: sedmlLocation,
                reports: reportIds.map((reportId: string): SedReportResults => {
                  const datasets = structureObject[sedmlLocation][reportId];
                  return {
                    uri: sedmlLocation + '/' + reportId,
                    id: reportId,
                    datasets: datasets,
                  };
                }),
              };
            },
          );
          return structureArray;
        }),

        catchError(
          (
            error: HttpErrorResponse,
          ): Observable<CombineResults | undefined> => {
            if (!environment.production) {
              console.error(error);
            }

            if (error instanceof HttpErrorResponse && error.status === 404) {
              return of<CombineResults>([]);
            } else {
              return of<undefined>(undefined);
            }
          },
        ),
      );
  }

  public getCombineResults(
    uuid: string,
    sparse = false,
  ): Observable<SedDatasetResultsMap | undefined> {
    const retryStrategy = new RetryStrategy();
    return this.http
      .get<SimulationRunResults>(
        // TODO Remove hardocoded string. Caused #2635
        `${this.resultsEndpoint}/${uuid}?includeData=${!sparse}`,
      )
      .pipe(
        retryWhen(retryStrategy.handler.bind(retryStrategy)),
        map(
          (result: SimulationRunResults): SimulationRunOutput[] =>
            result.outputs,
        ),
        map((reports: SimulationRunOutput[]): SedDatasetResultsMap => {
          const datasetResultsMap: SedDatasetResultsMap = {};

          reports.forEach((report: SimulationRunOutput): void => {
            const sedmlLocationReportId = report.outputId;

            const sedmlLocation = this.getLocationFromSedmLocationId(
              sedmlLocationReportId,
            );

            const reportId = this.getReportIdFromSedmlLocationId(
              sedmlLocationReportId,
            );

            report.data.forEach((datum: SimulationRunOutputDatum): void => {
              const uri = sedmlLocation + '/' + reportId + '/' + datum.id;
              datasetResultsMap[uri] = {
                uri: uri,
                id: datum.id,
                location: sedmlLocation,
                reportId: reportId,
                label: datum.label,
                values: datum.values,
              };
            });
          });

          return datasetResultsMap;
        }),

        catchError((error: HttpErrorResponse): Observable<undefined> => {
          if (!environment.production) {
            console.error(error);
          }
          return of<undefined>(undefined);
        }),
      );
  }

  public getLocationFromSedmLocationId(locationId: string): string {
    // Remove the last "/" and the text after the last "/"
    // EG simulation_1.sedml/subfolder1/Figure_3b" => simulation_1.sedml/subfolder1
    // TODO write tests
    return locationId.split('/').reverse().slice(1).reverse().join('/');
  }
  public getReportIdFromSedmlLocationId(location: string): string {
    return location.split('/').reverse()[0];
  }
  public getReportResultsUrl(
    runId: string,
    reportId: string,
    sparse = false,
  ): string {
    // TODO Remove hardocoded string. Caused #2635
    return `${
      this.resultsEndpoint
    }/${runId}/${reportId}?includeData=${!sparse}`;
  }

  public getSpecsOfSedPlotsInCombineArchive(
    runId: string,
  ): Observable<CombineArchive | undefined> {
    const archiveUrl = `${this.combineArchiveEndpoint}${runId}/download`;
    return this.combineService.getSpecsOfSedDocsInCombineArchive(archiveUrl);
  }
}

class RetryStrategy {
  constructor(
    private maxAttempts = 7,
    private initialDelayMs = 1000,
    private scalingFactor = 2,
    private includedStatusCodes: number[] = [500],
    private excludedStatusCodes: number[] = [],
    private shouldErrorBeRetried: (error: HttpErrorResponse) => boolean = (
      error: HttpErrorResponse,
    ) => true,
  ) {}

  handler(attempts: Observable<any>) {
    return attempts.pipe(
      mergeMap(
        (
          error: HttpErrorResponse,
          iRetryAttempt: number,
        ): Observable<number> => {
          if (iRetryAttempt + 1 >= this.maxAttempts) {
            return throwError(error);
          }

          if (
            this.includedStatusCodes.length &&
            !this.includedStatusCodes.includes(error.status)
          ) {
            return throwError(error);
          }

          if (this.excludedStatusCodes.includes(error.status)) {
            return throwError(error);
          }

          if (!this.shouldErrorBeRetried(error)) {
            return throwError(error);
          }

          const delay =
            this.initialDelayMs * this.scalingFactor ** iRetryAttempt;
          return timer(delay);
        },
      ),
    );
  }
}
