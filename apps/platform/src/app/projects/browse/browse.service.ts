import { Injectable } from '@angular/core';
import { combineLatest, map, mergeMap, Observable } from 'rxjs';
import {
  ArchiveMetadata,
  Project,
  SimulationRunMetadata,
} from '@biosimulations/datamodel/api';
import { ProjectSummary, FormattedDate } from './browse.model';
import {
  ProjectService,
  SimulationService,
} from '@biosimulations/angular-api-client';
import { UtilsService } from '@biosimulations/shared/services';

@Injectable({
  providedIn: 'root',
})
export class BrowseService {
  public DEFAULT_THUMBNAIL =
    './assets/images/default-resource-images/model-padded.svg';

  public constructor(
    private projService: ProjectService,
    private simService: SimulationService,
  ) {}
  public getProjects(): Observable<ProjectSummary[]> {
    const metadatas: Observable<ProjectSummary[]> = this.projService
      .getAllProjects()
      .pipe(
        map((simIds: Project[]) => {
          return simIds.map((simId: Project) => {
            return this.simService
              .getSimulationRunMetadata(simId.simulationRun)
              .pipe(
                map((metadata: SimulationRunMetadata) => {
                  return { id: simId.id, metadata: metadata };
                }),
              );
          });
        }),
        mergeMap((simMetadatas) => combineLatest(simMetadatas)),
        map((projects) => {
          return projects
            .map((project) => {
              const projmetadata = project.metadata;
              let metadata!: ArchiveMetadata;
              for (metadata of projmetadata.metadata) {
                if (metadata.uri.search('/') === -1) {
                  break;
                }
              }

              const thumbnail = metadata?.thumbnails?.length
                ? metadata?.thumbnails[0]
                : this.DEFAULT_THUMBNAIL;

              return {
                id: project.id,
                simulationRun: project.metadata.id,
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
              return a.metadata.title.localeCompare(
                b.metadata.title,
                undefined,
                {
                  numeric: true,
                },
              );
            });
        }),
      );
    return metadatas;
  }

  private formatDate(date: string): FormattedDate {
    const value = new Date(date);
    return {
      value: value,
      formattedValue: UtilsService.formatDate(value),
    };
  }
}
