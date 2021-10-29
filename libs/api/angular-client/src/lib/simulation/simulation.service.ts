import { Injectable } from '@angular/core';
import { environment } from '@biosimulations/shared/environments';
import { Observable, shareReplay } from 'rxjs';
import { retryWhen } from 'rxjs/operators';
import {
  SimulationRun,
  SimulationRunMetadata,
  CombineArchiveLog,
  SimulationRunResults,
  SimulationRunOutput,
} from '@biosimulations/datamodel/api';
import {
  SimulationRunSummary,
} from '@biosimulations/datamodel/common';
// import { SimulationRun } from '@biosimulations/datamodel/api';
import { HttpClient } from '@angular/common/http';
import { Endpoints } from '@biosimulations/config/common';
import { RetryStrategy } from '@biosimulations/shared/angular';

@Injectable({
  providedIn: 'root',
})
export class SimulationService {
  private endpoints = new Endpoints(environment.env);
  constructor(private http: HttpClient) {}

  public getSimulationRun(id: string): Observable<SimulationRun> {
    const url = this.endpoints.getSimulationRunEndpoint(id);
    const response = this.http.get<SimulationRun>(url).pipe(shareReplay(1));
    return response;
  }

  public getAllSimulationRunMetadata(): Observable<SimulationRunMetadata[]> {
    const url = this.endpoints.getSimulationRunMetadataEndpoint();
    const response = this.http.get<SimulationRunMetadata[]>(url);
    return response;
  }

  public getSimulationRunMetadata(
    id: string,
  ): Observable<SimulationRunMetadata> {
    const url = this.endpoints.getSimulationRunMetadataEndpoint(id);
    const response = this.http.get<SimulationRunMetadata>(url).pipe();

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
      );
    return response;
  }

  public getSimulationRunLog(id: string): Observable<CombineArchiveLog> {
    const endpoint = this.endpoints.getSimulationRunLogsEndpoint(id);
    return this.http.get<CombineArchiveLog>(endpoint);
  }

  public getSimulationRunSummary(
    id: string,
  ): Observable<SimulationRunSummary> {
    const url = this.endpoints.getSimulationRunSummariesEndpoint(id);
    const response = this.http.get<SimulationRunSummary>(url).pipe();
    return response;
  }
}
