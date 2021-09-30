import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import {
  ArchiveMetadata,
  SimulationRunMetadata,
} from '@biosimulations/datamodel/api';
// import { SimulationRun } from '@biosimulations/dispatch/api-models';
import { HttpClient } from '@angular/common/http';
import { Endpoints } from '@biosimulations/config/common';
import { ProjectSummary, FormattedDate, SimulatorIdNameMap } from './datamodel';
import { UtilsService } from '@biosimulations/shared/services';
import { urls } from '@biosimulations/config/common';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  public DEFAULT_THUMBNAIL =
    './assets/images/default-resource-images/model-padded.svg';

  private endpoints = new Endpoints();

  constructor(private http: HttpClient) {}

  public getProjectFile(id: string, file: string) {
    const url = this.endpoints.getSimulationRunFileEndpoint(id, file);
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
      map((project: SimulationRunMetadata) => {
        let metadata!: ArchiveMetadata;
        for (metadata of project.metadata) {
          if (metadata.uri.search('/') === -1) {
            break;
          }
        }
        return metadata;
      }),
    );

    return metaData;
  }

  public getProject(id: string): Observable<SimulationRunMetadata> {
    const url = this.endpoints.getMetadataEndpoint(id);
    const response = this.http.get<SimulationRunMetadata>(url).pipe();

    return response;
  }

  public getProjectSimulation(id: string): Observable<any> { // SimulationRun
    const url = this.endpoints.getSimulationRunEndpoint(id);
    const response = this.http.get<any>(url).pipe(shareReplay(1)); // SimulationRun
    return response;
  }

  public getProjectSimulationLog(id: string): Observable<any> {
    const endpoint = `${urls.dispatchApi}logs/${id}`;
    return this.http.get(endpoint);
  }

  public getProjects(): Observable<ProjectSummary[]> {
    const url = this.endpoints.getMetadataEndpoint();
    const response = this.http.get<SimulationRunMetadata[]>(url).pipe(
      map((projects: SimulationRunMetadata[]) => {
        return projects
          .map((project: SimulationRunMetadata) => {
            let metadata!: ArchiveMetadata;
            for (metadata of project.metadata) {
              if (metadata.uri.search('/') === -1) {
                break;
              }
            }

            const thumbnail = metadata?.thumbnails?.length
              ? metadata?.thumbnails[0]
              : this.DEFAULT_THUMBNAIL;

            return {
              id: project.id,
              metadata: {
                title: metadata?.title || project.id,
                thumbnail: thumbnail,
                abstract: metadata?.abstract,
                keywords: metadata.keywords,
                taxa: metadata.taxa,
                encodes: metadata.encodes,
                identifiers: metadata.identifiers,
                citations: metadata.citations,
                creators: metadata.creators,
                contributors: metadata.contributors,
                license: metadata?.license,
                funders: metadata.funders,
                created: this.formatDate(metadata.created),
                modified: metadata.modified.map(
                  (date: string): FormattedDate => this.formatDate(date),
                ),
              },
            };
          })
          .sort((a: ProjectSummary, b: ProjectSummary): number => {
            return a.metadata.title.localeCompare(b.metadata.title, undefined, {
              numeric: true,
            });
          });
      }),
    );
    return response;
  }

  private formatDate(date: string): FormattedDate {
    const value = new Date(date);
    return {
      value: value,
      formattedValue: UtilsService.getDateString(value),
    };
  }

  public getSimulatorIdNameMap(): Observable<SimulatorIdNameMap> {
    const endpoint = `${urls.simulatorsApi}simulators/latest`;
    return this.http.get(endpoint).pipe(
      shareReplay(1),
      map((simulators: any): SimulatorIdNameMap => {
        const idNameMap: SimulatorIdNameMap = {};
        simulators.forEach((simulator: any): void => {
          idNameMap[simulator.id] = simulator.name;
        })
        return idNameMap;
      }),
    );
  }
}
