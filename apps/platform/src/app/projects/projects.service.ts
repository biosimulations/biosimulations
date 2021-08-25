import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  ArchiveMetadata,
  SimulationRunMetadata,
} from '@biosimulations/datamodel/api';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  constructor(private http: HttpClient) {}

  public getArchiveMetadata(id: string): Observable<ArchiveMetadata> {
    const metaData: Observable<ArchiveMetadata> = this.getProject(id).pipe(
      map((project) => project.metadata[0]),
    );

    return metaData;
  }
  public getProject(id: string): Observable<SimulationRunMetadata> {
    // TODO remove hardcoded url, use correct deployments
    const response = this.http
      .get<SimulationRunMetadata>('https://run.api.biosimulations.dev/metadata/ + id)
      .pipe();

    return response;
  }
}
