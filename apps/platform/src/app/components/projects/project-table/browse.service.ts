import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ProjectSummary, SimulationRunMetadataSummary, LabeledIdentifier } from '@biosimulations/datamodel/common';
import { FormattedProjectSummary, LocationPredecessor } from './browse.model';
import { ProjectService, SearchCriteria } from '@biosimulations/angular-api-client';
import { BiosimulationsError } from '@biosimulations/shared/error-handler';
import { HttpStatusCode } from '@angular/common/http';
import { Endpoints } from '@biosimulations/config/common';
import { Thumbnail } from '@biosimulations/datamodel/common';

@Injectable({
  providedIn: 'root',
})
export class BrowseService {
  private endpoints: Endpoints;
  public DEFAULT_THUMBNAIL = './assets/images/default-resource-images/model-padded.svg';
  public constructor(private projectService: ProjectService) {
    this.endpoints = new Endpoints();
  }

  public getProjects(criteria: SearchCriteria): Observable<FormattedProjectSummary[]> {
    const metadatas: Observable<FormattedProjectSummary[]> = this.projectService.getProjectSummaries(criteria).pipe(
      map((projects: ProjectSummary[]) => {
        return projects
          .map((project: ProjectSummary): FormattedProjectSummary => {
            const run = project.simulationRun;
            const simulationRun = run.run;
            const metadata = run?.metadata?.filter((metadatum: SimulationRunMetadataSummary): boolean => {
              return metadatum.uri === '.';
            })?.[0];
            if (!run.metadata) {
              throw new BiosimulationsError(
                'Project summary not found',
                `We're sorry! An error occurred while retrieving a summary of project ${project.id}.`,
                HttpStatusCode.InternalServerError,
              );
            }

            const otherMetadata =
              run?.metadata?.filter((metadatum: SimulationRunMetadataSummary): boolean => {
                return metadatum.uri !== '.';
              }) || [];
            let thumbnail = this.DEFAULT_THUMBNAIL;
            if (metadata?.thumbnails?.length) {
              // handle cases where thumbnails are provided as urls
              if (metadata.thumbnails[0].startsWith('http')) {
                thumbnail = metadata.thumbnails[0];
                // handle cases where thumbnails are provided as relative paths
              } else {
                thumbnail = this.endpoints.getSimulationRunFilesDownloadEndpoint(
                  false,
                  run.id,
                  metadata.thumbnails[0],
                  Thumbnail.browse,
                );
              }
            }

            return {
              id: project.id,
              title: metadata?.title || project.id,
              simulationRun: {
                id: run.id,
                name: run.name,
                simulator: simulationRun.simulator.id,
                simulatorName: simulationRun.simulator.name,
                simulatorVersion: simulationRun.simulator.version,
                cpus: simulationRun.cpus,
                memory: simulationRun.memory,
                envVars: simulationRun.envVars,
                runtime: simulationRun.runtime as number,
                projectSize: simulationRun.projectSize as number,
                resultsSize: simulationRun.resultsSize as number,
                submitted: this.formatDate(run.submitted),
                updated: this.formatDate(run.updated),
              },
              tasks: run.tasks || [],
              outputs: run.outputs || [],
              metadata: {
                abstract: metadata?.abstract,
                description: metadata?.description,
                thumbnail: thumbnail,
                keywords: metadata?.keywords || [],
                taxa: metadata?.taxa || [],
                encodes: metadata?.encodes || [],
                identifiers: metadata?.identifiers || [],
                citations: metadata?.citations || [],
                creators: metadata?.creators || [],
                contributors: metadata?.contributors || [],
                license: metadata?.license,
                funders: metadata?.funders || [],
                other: metadata?.other || [],
                locationPredecessors: otherMetadata.flatMap(
                  (otherMetadatum: SimulationRunMetadataSummary): LocationPredecessor[] => {
                    return (otherMetadatum?.predecessors || []).map(
                      (predecessor: LabeledIdentifier): LocationPredecessor => {
                        return {
                          location: otherMetadatum.uri,
                          predecessor: {
                            label: predecessor?.label,
                            uri: predecessor?.uri,
                          },
                        };
                      },
                    );
                  },
                ),
                created: metadata?.created ? this.formatDate(metadata?.created) : undefined,
                modified: metadata?.modified?.[0] ? this.formatDate(metadata?.modified?.[0]) : undefined,
              },
              owner: project?.owner,
              created: this.formatDate(project.created),
              updated: this.formatDate(project.updated),
            };
          })
          .sort((a: FormattedProjectSummary, b: FormattedProjectSummary): number => {
            return a.title.localeCompare(b.title, undefined, {
              numeric: true,
            });
          });
      }),
    );
    return metadatas;
  }

  private formatDate(date: string): Date {
    return new Date(date);
  }
}
