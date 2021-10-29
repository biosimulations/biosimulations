import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Endpoints } from '@biosimulations/config/common';
import {
  Project,
  ProjectInput,
  File as IFile,
  SimulatorIdNameMap,
  SimulationRunSedDocument,
  ISimulator,
} from '@biosimulations/datamodel/common';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private endpoints = new Endpoints();

  constructor(private http: HttpClient) {}

  public publishProject(projectInput: ProjectInput): Observable<Project> {
    const url = this.endpoints.getProjectsEndpoint();
    const response = this.http
      .post<Project>(url, projectInput, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(shareReplay(1));
    return response;
  }

  public getAllProjects(): Observable<Project[]> {
    const url = this.endpoints.getProjectsEndpoint();
    const response = this.http.get<Project[]>(url).pipe(shareReplay(1));
    return response;
  }

  public getProject(projectId: string): Observable<Project> {
    const url = this.endpoints.getProjectsEndpoint(projectId);
    const response = this.http.get<Project>(url).pipe(shareReplay(1));
    return response;
  }

  public getProjectFile(id: string, file: string) {
    const url = this.endpoints.getSimulationRunFileEndpoint(id, file);
    return this.http.get(url);
  }

  public getArchiveContents(id: string): Observable<IFile[]> {
    const url = this.endpoints.getArchiveContentsEndpoint(id);
    const response = this.http.get<IFile[]>(url).pipe();
    return response;
  }

  public getProjectSedmlContents(
    id: string,
  ): Observable<SimulationRunSedDocument[]> {
    const url = this.endpoints.getSpecificationsEndpoint(id);
    const response = this.http.get<SimulationRunSedDocument[]>(url).pipe();
    return response;
  }

  public getSimulatorIdNameMap(): Observable<SimulatorIdNameMap> {
    const endpoint = this.endpoints.getSimulatorsEndpoint(undefined, 'latest');
    return this.http.get<ISimulator[]>(endpoint).pipe(
      shareReplay(1),
      map((simulators: ISimulator[]): SimulatorIdNameMap => {
        const idNameMap: SimulatorIdNameMap = {};
        simulators.forEach((simulator: ISimulator): void => {
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
