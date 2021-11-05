import { Injectable } from '@angular/core';
import { environment } from '@biosimulations/shared/environments';
import { Observable, shareReplay } from 'rxjs';
import { retryWhen } from 'rxjs/operators';
import {
  SimulationRun,
  SimulationRunMetadata,
  SimulationRunResults,
  SimulationRunOutput,
} from '@biosimulations/datamodel/api';
import {
  SimulationRunSummary,
  CombineArchiveLog,
  File as IFile,
  SimulationRunSedDocument,
} from '@biosimulations/datamodel/common';
import { HttpClient } from '@angular/common/http';
import { Endpoints } from '@biosimulations/config/common';
import { RetryStrategy } from '@biosimulations/shared/angular';

@Injectable({
  providedIn: 'root',
})
export class SimulationRunService {
  private endpoints = new Endpoints(environment.env);
  constructor(private http: HttpClient) {}

  public getSimulationRun(id: string): Observable<SimulationRun> {
    const url = this.endpoints.getSimulationRunEndpoint(id);
    const response = this.http.get<SimulationRun>(url).pipe(shareReplay(1));
    return response;
  }

  public getSimulationRunFiles(id: string): Observable<IFile[]> {
    const url = this.endpoints.getSimulationRunFilesEndpoint(id);
    const response = this.http.get<IFile[]>(url).pipe(shareReplay(1));
    return response;
  }

  public getSimulationRunFileContent(id: string, file: string) {
    const url = this.endpoints.getSimulationRunFileContentEndpoint(id, file);
    return this.http.get(url);
  }

  public getSimulationRunSimulationSpecifications(
    id: string,
  ): Observable<SimulationRunSedDocument[]> {
    const url = this.endpoints.getSpecificationsEndpoint(id);
    const response = this.http.get<SimulationRunSedDocument[]>(url).pipe(shareReplay(1));
    return response;
  }

  public getSimulationRunMetadata(
    id: string,
  ): Observable<SimulationRunMetadata> {
    const url = this.endpoints.getSimulationRunMetadataEndpoint(id);
    const response = this.http.get<SimulationRunMetadata>(url).pipe(shareReplay(1));

    return response;
  }

  public getSimulationRunResults(
    id: string,
    includeData = false,
  ): Observable<SimulationRunResults> {
    const url = this.endpoints.getRunResultsEndpoint(
      id,
      undefined,
      includeData,
    );
    const retryStrategy = new RetryStrategy();
    const response = this.http
      .get<SimulationRunResults>(url)
      .pipe(
        shareReplay(1),
        retryWhen(retryStrategy.handler.bind(retryStrategy)),
        shareReplay(1),
      );
    return response;
  }

  public getSimulationRunOutputResults(
    id: string,
    outputId: string,
    includeData = false,
  ): Observable<SimulationRunOutput> {
    const url = this.endpoints.getRunResultsEndpoint(id, outputId, includeData);
    const retryStrategy = new RetryStrategy();
    const response = this.http
      .get<SimulationRunOutput>(url)
      .pipe(
        shareReplay(1),
        retryWhen(retryStrategy.handler.bind(retryStrategy)),
        shareReplay(1),
      );
    return response;
  }

  public getSimulationRunLog(id: string): Observable<CombineArchiveLog> {
    const endpoint = this.endpoints.getSimulationRunLogsEndpoint(id);
    return this.http.get<CombineArchiveLog>(endpoint).pipe(shareReplay(1));
  }

  public getSimulationRunSummary(id: string): Observable<SimulationRunSummary> {
    const url = this.endpoints.getSimulationRunSummariesEndpoint(id);
    const response = this.http.get<SimulationRunSummary>(url).pipe(shareReplay(1));
    return response;
  }
}
