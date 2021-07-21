import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { ArchiveMetadata } from '@biosimulations/datamodel/common';
import {
  ArchiveMetadata as APIMetadata,
  Project,
} from '@biosimulations/datamodel/api';
import { ProjectsService } from '../projects.service';
import { environment } from '@biosimulations/shared/environments';
@Injectable({
  providedIn: 'root',
})
export class ViewService {
  constructor(private service: ProjectsService) {}

  public getArchiveMetadata(id: string): Observable<ArchiveMetadata> {
    const metaData: Observable<ArchiveMetadata> = this.getProjectMetadata(
      id,
    ).pipe(map((metadata) => metadata[0]));

    return metaData;
  }
  public getProjectMetadata(id: string): Observable<ArchiveMetadata[]> {
    const response: Observable<ArchiveMetadata[]> = this.service
      .getProject(id)
      .pipe(
        // Only call the HTTP service once
        shareReplay(1),
        map((data: Project) => {
          console.assert(environment.production, data);
          return data.metadata.map((metaData: APIMetadata) => {
            return {
              ...metaData,
              created: new Date(metaData.created),
              modified: metaData.modified.map((modified) => new Date(modified)),
            };
          });
        }),
        // Only do the above mapping once
        shareReplay(1),
      );

    return response;
  }
}
