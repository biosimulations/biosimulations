import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  ArchiveMetadata,
  SimulationRunMetadata,
} from '@biosimulations/datamodel/api';
import { ProjectSummary, FormattedDate } from './browse.model';
import { ProjectsService } from '@biosimulations/view-service';
import { UtilsService } from '@biosimulations/shared/services';

@Injectable({
  providedIn: 'root',
})
export class BrowseService {
  public DEFAULT_THUMBNAIL =
    './assets/images/default-resource-images/model-padded.svg';

  constructor(private service: ProjectsService) {}

  public getProjects(): Observable<ProjectSummary[]> {
    const response = this.service.getSimulationRunMetadatas().pipe(
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
      formattedValue: UtilsService.formatDate(value),
    };
  }
}
