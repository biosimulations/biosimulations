import { Injectable } from '@angular/core';
import { map, Observable, pluck, shareReplay } from 'rxjs';
import { ArchiveMetadata } from '@biosimulations/datamodel/common';
import {
  ArchiveMetadata as APIMetadata,
  SimulationRunMetadata,
} from '@biosimulations/datamodel/api';
// import { SimulationRun } from '@biosimulations/dispatch/api-models';
import { ProjectsService } from '../projects.service';

@Injectable({
  providedIn: 'root',
})
export class ViewService {
  public constructor(private service: ProjectsService) {}

  public getArchiveMetadata(id: string): Observable<ArchiveMetadata> {
    const metaData: Observable<ArchiveMetadata> = this.getProjectMetadata(
      id,
    ).pipe(map((metadata) => metadata[0]));

    return metaData;
  }

  public getOtherMetadata(id: string): Observable<ArchiveMetadata[]> {
    const metadata: Observable<ArchiveMetadata[]> = this.getProjectMetadata(
      id,
    ).pipe(
      map((data: ArchiveMetadata[]) => {
        return data.slice(1);
      }),
      //tap((data) => console.log(data))
    );
    return metadata;
  }
  public getProjectMetadata(id: string): Observable<ArchiveMetadata[]> {
    const response: Observable<ArchiveMetadata[]> = this.service
      .getProject(id)
      .pipe(
        // Only call the HTTP service once
        shareReplay(1),
        map((data: SimulationRunMetadata) => {
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

  public getSimulationRunMetadata(id: string): Observable<any> { // SimulationRun
    return this.service.getProjectSimulation(id);
  }

  public getFilesMetadata(id: string) {
    return this.service.getArchiveContents(id);
  }
  public getVegaFilesMetadata(id: string) {
    return this.service.getArchiveContents(id).pipe(
      pluck('contents'),
      // Get the information for the files that have vega format
      map((data) =>
        data.filter((item: any) =>
          item.format.endsWith(
            'http://purl.org/NET/mediatypes/application/vega+json',
          ),
        ),
      ),
    );
  }
  public getVegaVisualizations(
    id: string,
  ): Observable<
    [{ id: string; path: string; spec: Observable<{ $schema: string }> }]
  > {
    return this.getVegaFilesMetadata(id).pipe(
      // Just need the information about the path of the file within the archive
      map((data) => data.map((item: any) => item.location.path)),
      map((paths) =>
        paths.map((path: string) => {
          return {
            path: path,
            id: id,
            spec: this.service.getProjectFile(id, path),
          };
        }),
      ),
    );
  }
  public getSedmlVisualizations(id: string): Observable<string[]> {
    return this.service.getProjectSedmlContents(id);
  }

  public getProjectSedmlContent(id: string): Observable<string> {
    return this.service.getProjectSedmlContents(id);
  }
}
