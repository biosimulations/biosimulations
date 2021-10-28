import { Injectable } from '@angular/core';
import { combineLatest, map, mergeMap, Observable } from 'rxjs';
import {
  Project,
  ProjectSummary
} from '@biosimulations/datamodel/common';
import { FormattedProjectSummary, FormattedDate } from './browse.model';
import { ProjectService } from '@biosimulations/angular-api-client';
import { FormatService } from '@biosimulations/shared/services';

@Injectable({
  providedIn: 'root',
})
export class BrowseService {
  public DEFAULT_THUMBNAIL =
    './assets/images/default-resource-images/model-padded.svg';

  public constructor(
    private service: ProjectService,
  ) {}
  public getProjects(): Observable<FormattedProjectSummary[]> {
    const metadatas: Observable<FormattedProjectSummary[]> = this.service
      .getAllProjects()
      .pipe(
        map((projects: Project[]) => {
          return projects.map((project: Project) => {
            return this.service
              .getProjectSummary(project.id)
              .pipe(                
                map((project: ProjectSummary): FormattedProjectSummary => {
                  const simulationRun = project.simulationRun;
                  const metadata = project.projectMetadata;

                  const thumbnail = metadata?.thumbnails?.length
                    ? metadata?.thumbnails[0]
                    : this.DEFAULT_THUMBNAIL;

                  return {
                    id: project.id,
                    title: metadata.title || project.id,
                    simulationRun: {
                      id: simulationRun.id,
                      name: simulationRun.name,
                      simulator: simulationRun.simulator,
                      simulatorVersion: simulationRun.simulatorVersion,
                      cpus: simulationRun.cpus,
                      memory: simulationRun.memory,
                      envVars: simulationRun.envVars,
                      runtime: simulationRun.runtime,
                      projectSize: simulationRun.projectSize,
                      resultsSize: simulationRun.resultsSize,
                      submitted: this.formatDate(simulationRun.submitted),
                      updated: this.formatDate(simulationRun.updated),
                    },
                    metadata: {
                      abstract: metadata?.abstract,
                      thumbnail: thumbnail,
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
                      modified: metadata?.modified ? this.formatDate(metadata?.modified) : undefined,
                    },
                    created: this.formatDate(project.created),
                    updated: this.formatDate(project.updated),
                  };
                }),
              );
          });
        }),
        mergeMap((projectSummaries) => combineLatest(projectSummaries)),
        map((projects): FormattedProjectSummary[] => {
          return projects            
            .sort((a: FormattedProjectSummary, b: FormattedProjectSummary): number => {
              return a.title.localeCompare(
                b.title,
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
      formattedValue: FormatService.formatDate(value),
    };
  }
}
