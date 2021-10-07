import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { retryWhen } from 'rxjs/operators';
import { SimulationRunMetadata } from '@biosimulations/datamodel/api';
// import { SimulationRun } from '@biosimulations/datamodel/api';
import { HttpClient } from '@angular/common/http';
import { Endpoints } from '@biosimulations/config/common';
import {
  CombineArchiveContent,
  SimulatorIdNameMap,
} from '@biosimulations/datamodel/common';
import { RetryStrategy } from '@biosimulations/shared/services';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private endpoints = new Endpoints();

  constructor(private http: HttpClient) {}

  public getProjectFile(id: string, file: string) {
    const url = this.endpoints.getSimulationRunFileEndpoint(id, file);
    return this.http.get(url);
  }

  public getArchiveContents(id: string): Observable<CombineArchiveContent[]> {
    const url = this.endpoints.getArchiveContentsEndpoint(id);
    const response = this.http.get<CombineArchiveContent[]>(url).pipe();
    return response;
  }

  public getProjectSedmlContents(id: string): Observable<any> {
    const url = this.endpoints.getArchiveSedmlContentsEndpoint(id);
    const response = this.http.get<any>(url).pipe();
    return response;
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
