import { Injectable } from '@angular/core';
import { combineLatest, map, mergeMap, Observable } from 'rxjs';
import {
  Project,
  SimulationRunSummary,
} from '@biosimulations/datamodel/common';
import { FormattedProjectSummary, FormattedDate } from './browse.model';
import { ProjectService } from '@biosimulations/angular-api-client';
import { SimulationService } from '@biosimulations/angular-api-client';
import { FormatService } from '@biosimulations/shared/services';

@Injectable({
  providedIn: 'root',
})
export class BrowseService {
  public DEFAULT_THUMBNAIL =
    './assets/images/default-resource-images/model-padded.svg';

  public constructor(
    private projectService: ProjectService,
    private simulationService: SimulationService,
  ) {}
  public getProjects(): Observable<FormattedProjectSummary[]> {
    const metadatas: Observable<FormattedProjectSummary[]> = this.projectService
      .getAllProjects()
      .pipe(
        map((projects: Project[]) => {
          return projects.map((project: Project) => {
            return this.simulationService
              .getSimulationRunSummary(project.simulationRun)
              .pipe(
                map((run: SimulationRunSummary): FormattedProjectSummary => {
                  const simulationRun = run.run;
                  const metadata = run.metadata;

                  const thumbnail = metadata?.thumbnails?.length
                    ? metadata?.thumbnails[0]
                    : this.DEFAULT_THUMBNAIL;

                  return {
                    id: project.id,
                    title: metadata.title || project.id,
                    simulationRun: {
                      id: run.id,
                      name: run.name,
                      simulator: simulationRun.simulator.id,
                      simulatorVersion: simulationRun.simulator.version,
                      cpus: simulationRun.cpus,
                      memory: simulationRun.memory,
                      envVars: simulationRun.envVars,
                      runtime: simulationRun.runtime,
                      projectSize: simulationRun.projectSize,
                      resultsSize: simulationRun.resultsSize,
                      submitted: this.formatDate(run.submitted),
                      updated: this.formatDate(run.updated),
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
                      modified: metadata?.modified
                        ? this.formatDate(metadata?.modified)
                        : undefined,
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
          return projects.sort(
            (
              a: FormattedProjectSummary,
              b: FormattedProjectSummary,
            ): number => {
              return a.title.localeCompare(b.title, undefined, {
                numeric: true,
              });
            },
          );
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
