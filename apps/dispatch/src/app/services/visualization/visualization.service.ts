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
    return this.http
      .get<SimulationRunResults>(
        // TODO Remove hardocoded string. Caused #2635
        `${this.resultsEndpoint}/${uuid}?includeData=${!sparse}`,
      )
      .pipe(
        map(
          (result: SimulationRunResults): SimulationRunOutput[] =>
            result.outputs,
        ),
        map(
          (reports: SimulationRunOutput[]): CombineResults => {
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
                  location: sedmlLocation,
                  reports: reportIds.map(
                    (reportId: string): SedReportResults => {
                      const datasets = structureObject[sedmlLocation][reportId];
                      return {
                        id: reportId,
                        datasets: datasets,
                      };
                    },
                  ),
                };
              },
            );
            return structureArray;
          },
        ),

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
    return this.http
      .get<SimulationRunResults>(
        // TODO Remove hardocoded string. Caused #2635
        `${this.resultsEndpoint}/${uuid}?includeData=${!sparse}`,
      )
      .pipe(
        map(
          (result: SimulationRunResults): SimulationRunOutput[] =>
            result.outputs,
        ),
        map(
          (reports: SimulationRunOutput[]): SedDatasetResultsMap => {
            const datasetResultsMap: SedDatasetResultsMap = {};

            reports.forEach((report: SimulationRunOutput): void => {
              const sedmlLocationReportId = report.outputId;
              const sedmlLocation = sedmlLocationReportId
                .split('/')
                .reverse()
                .slice(1)
                .reverse()
                .join('/');
              const reportId = sedmlLocationReportId.split('/').reverse()[0];

              report.data.forEach((datum: SimulationRunOutputDatum): void => {
                datasetResultsMap[datum.id] = {
                  id: datum.id,
                  location: sedmlLocation,
                  reportId: reportId,
                  label: datum.label,
                  values: datum.values,
                };
              });
            });

            return datasetResultsMap;
          },
        ),

        catchError(
          (error: HttpErrorResponse): Observable<undefined> => {
            if (!environment.production) {
              console.error(error);
            }
            return of<undefined>(undefined);
          },
        ),
      );
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
