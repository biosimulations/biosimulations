import { Injectable } from '@angular/core';
import { environment } from '@biosimulations/shared/environments';
import { map, Observable, shareReplay } from 'rxjs';
import { retryWhen } from 'rxjs/operators';
import {
  SimulationRun,
  SimulationRunMetadata,
} from '@biosimulations/datamodel/api';
// import { SimulationRun } from '@biosimulations/datamodel/api';
import { HttpClient } from '@angular/common/http';
import { Endpoints } from '@biosimulations/config/common';
import { SimulatorIdNameMap } from '@biosimulations/datamodel/common';
import { RetryStrategy } from '@biosimulations/shared/services';

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
    outputId?: string,
    includeData = false,
  ): Observable<any> {
    const url = this.endpoints.getRunResultsEndpoint(id, outputId, includeData);
    const retryStrategy = new RetryStrategy();
    const response = this.http
      .get<any>(url)
      .pipe(
        shareReplay(1),
        retryWhen(retryStrategy.handler.bind(retryStrategy)),
      );
    return response;
  }

  public getSimulationRunLog(id: string): Observable<any> {
    const endpoint = this.endpoints.getRunLogsEndpoint(id);
    return this.http.get(endpoint);
  }
}
