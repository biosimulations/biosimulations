import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ArchiveMetadata, Project } from '@biosimulations/datamodel/api';
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
  public getProject(id: string): Observable<Project> {
    const response = this.http
      .get<Project>('http://localhost:3333/projects/' + id)
      .pipe();

    return response;
  }
}
