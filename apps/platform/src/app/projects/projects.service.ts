import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  ArchiveMetadata,
  SimulationRunMetadata,
} from '@biosimulations/datamodel/api';
import { HttpClient } from '@angular/common/http';
import { Endpoints } from '@biosimulations/config/common';
@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private endpoints = new Endpoints();
  constructor(private http: HttpClient) {}

  public getProjectFile(id: string, file: string) {
    const archiveUrl = this.endpoints.getRunDownloadEndpoint(id, true);
    const url = this.endpoints.getCombineFilesEndpoint(archiveUrl, file);
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
  public getArchiveMetadata(id: string): Observable<ArchiveMetadata> {
    const metaData: Observable<ArchiveMetadata> = this.getProject(id).pipe(
      map((project) => project.metadata[0]),
    );

    return metaData;
  }
  public getProject(id: string): Observable<SimulationRunMetadata> {
    const url = this.endpoints.getMetadataEndpoint(id);
    const response = this.http.get<SimulationRunMetadata>(url).pipe();

    return response;
  }
  public getProjectSimulation(id: string): Observable<any> {
    const url = this.endpoints.getSimulationRunEndpoint(id);
    const response = this.http.get<string>(url).pipe();
    return response;
  }
  public getProjects(): Observable<
    { id: string; thumbnails: string[]; title: string }[]
  > {
    const url = this.endpoints.getMetadataEndpoint();
    const response = this.http.get<SimulationRunMetadata[]>(url).pipe(
      map((projects) => {
        return projects.map((project) => {
          const thumbnails = project.metadata[0]?.thumbnails || [];
          if (thumbnails.length == 0) {
            thumbnails.push(
              './assets/images/default-resource-images/model.svg',
            );
          }
          return {
            id: project.id,
            title: project.metadata[0]?.title || project.id,
            thumbnails: thumbnails,
          };
        });
      }),
    );
    return response;
  }
}
