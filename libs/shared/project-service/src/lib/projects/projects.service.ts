import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { retryWhen } from 'rxjs/operators';
import { SimulationRunMetadata } from '@biosimulations/datamodel/api';
// import { SimulationRun } from '@biosimulations/datamodel/api';
import { HttpClient } from '@angular/common/http';
import { Endpoints } from '@biosimulations/config/common';
import { SimulatorIdNameMap } from '@biosimulations/datamodel/common';
import { RetryStrategy } from '@biosimulations/shared/services';

// TODO refactor
/**
 * project service is restricted to platform- uses the projects endpoint
 * simulationRun service - get simulations runs
 * metadata service - get metadata
 * files service - get files
 * specs service - get specs
 * rename libary to angualar-api-client
 *
 *
 */
@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private endpoints = new Endpoints();

  constructor(private http: HttpClient) {}

  public getSimulationRunMetadatas(): Observable<SimulationRunMetadata[]> {
    const url = this.endpoints.getSimulationRunMetadataEndpoint();
    const response = this.http.get<SimulationRunMetadata[]>(url);
    return response;
  }

  public getProjectFile(id: string, file: string) {
    const url = this.endpoints.getSimulationRunFileEndpoint(id, file);
    return this.http.get(url);
  }

  public getArchiveContents(id: string): Observable<any> {
    const url = this.endpoints.getArchiveContentsEndpoint(id);
    const response = this.http.get<any>(url).pipe();
    return response;
  }

  public getProjectSedmlContents(id: string): Observable<any> {
    const url = this.endpoints.getArchiveSedmlContentsEndpoint(id);
    const response = this.http.get<any>(url).pipe();
    return response;
  }

  public getMetadata(id: string): Observable<SimulationRunMetadata> {
    const url = this.endpoints.getSimulationRunMetadataEndpoint(id);
    const response = this.http.get<SimulationRunMetadata>(url).pipe();

    return response;
  }

  public getSimulationRun(id: string): Observable<any> {
    // SimulationRun
    const url = this.endpoints.getSimulationRunEndpoint(id);
    const response = this.http.get<any>(url).pipe(shareReplay(1)); // SimulationRun
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

  public addFileToCombineArchive(
    archiveFileOrUrl: File | string,
    newContentLocation: string,
    newContentFormat: string,
    newContentMaster: boolean,
    newContentFile: Blob,
    overwriteLocations = false,
    download = false,
  ): Observable<ArrayBuffer | string> {
    const formData = new FormData();

    if (typeof archiveFileOrUrl === 'object') {
      formData.append('files', archiveFileOrUrl);
      formData.append(
        'archive',
        JSON.stringify({ filename: archiveFileOrUrl.name }),
      );
    } else {
      formData.append('archive', JSON.stringify({ url: archiveFileOrUrl }));
    }

    const newContentFilename = '__new_content__';
    formData.append('files', newContentFile, newContentFilename);

    formData.append(
      'newContent',
      JSON.stringify({
        _type: 'CombineArchiveContent',
        location: newContentLocation,
        format: newContentFormat,
        master: newContentMaster,
        filename: newContentFilename,
      }),
    );

    formData.append('overwriteLocations', JSON.stringify(overwriteLocations));
    formData.append('download', JSON.stringify(download));

    const headers = {
      Accept: 'application/zip',
    };

    return this.http.post<string>(
      this.endpoints.getAddFileToCombineArchiveEndpoint(),
      formData,
      {
        headers: headers,
        responseType: 'json',
      },
    );
  }
}
