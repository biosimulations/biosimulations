import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { retryWhen } from 'rxjs/operators';
import { SimulationRunMetadata } from '@biosimulations/datamodel/api';
// import { SimulationRun } from '@biosimulations/dispatch/api-models';
import { HttpClient } from '@angular/common/http';
import { Endpoints } from '@biosimulations/config/common';
import { SimulatorIdNameMap } from '@biosimulations/datamodel/common';
import { RetryStrategy } from '@biosimulations/shared/services';


@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private endpoints = new Endpoints();

  constructor(private http: HttpClient) {}

  public getSimulationRunMetadatas(): Observable<SimulationRunMetadata[]> {
    const url = this.endpoints.getMetadataEndpoint();
    const response = this.http.get<SimulationRunMetadata[]>(url);
    return response;
  }

  public getProjectFile(id: string, file: string) {
    // Todo: uncomment and remove below
    // const url = this.endpoints.getSimulationRunFileEndpoint(id, file);
    const omexUrl = this.endpoints.getRunDownloadEndpoint(id);
    const url = this.endpoints.getCombineFilesEndpoint(omexUrl, file);
    return this.http.get(url);
  }

  public getArchiveContents(id: string): Observable<any> {
    const url = this.endpoints.getArchiveContentsEndpoint();
    const omex = this.endpoints.getRunDownloadEndpoint(id, true);
    const body = new FormData();
    body.append('url', omex);

    const response = this.http.post<any>(url, body).pipe();
    return response;
  }

  public getProjectSedmlContents(id: string): Observable<any> {
    const url = this.endpoints.getArchiveSedmlContentsEndpoint();
    const omex = this.endpoints.getRunDownloadEndpoint(id, true);
    const body = new FormData();
    body.append('url', omex);

    const response = this.http.post<any>(url, body).pipe();
    return response;
  }

  public getProject(id: string): Observable<SimulationRunMetadata> {
    const url = this.endpoints.getMetadataEndpoint(id);
    const response = this.http.get<SimulationRunMetadata>(url).pipe();

    return response;
  }

  public getSimulationRun(id: string): Observable<any> { // SimulationRun
    const url = this.endpoints.getSimulationRunEndpoint(id);
    const response = this.http.get<any>(url).pipe(shareReplay(1)); // SimulationRun
    return response;
  }

  public getSimulationRunResults(id: string, outputId?: string, includeData = false): Observable<any> {
    const url = this.endpoints.getRunResultsEndpoint(id, outputId, includeData);
    const retryStrategy = new RetryStrategy();
    const response = this.http.get<any>(url).pipe(
      shareReplay(1),
      retryWhen(retryStrategy.handler.bind(retryStrategy)),
    );
    return response;
  }

  public getSimulationRunLog(id: string): Observable<any> {
    const endpoint = this.endpoints.getRunLogsEndpoint(id);
    return this.http.get(endpoint);
  }

  public getSimulatorIdNameMap(): Observable<SimulatorIdNameMap> {
    const endpoint = this.endpoints.getSimulatorsEndpoint(undefined, 'latest');
    return this.http.get(endpoint).pipe(
      shareReplay(1),
      map((simulators: any): SimulatorIdNameMap => {
        const idNameMap: SimulatorIdNameMap = {};
        simulators.forEach((simulator: any): void => {
          idNameMap[simulator.id] = simulator.name;
        });
        return idNameMap;
      }),
    );
  }
}
