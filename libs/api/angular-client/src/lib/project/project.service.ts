import { Injectable } from '@angular/core';
import { map, Observable, shareReplay, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  HttpClient,
  HttpErrorResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { Endpoints } from '@biosimulations/config/common';
import {
  Project,
  ProjectInput,
  ProjectSummary,
} from '@biosimulations/datamodel/common';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private endpoints = new Endpoints();

  private cachedProjectId?: string;
  private cachedProjectObservables: { [endpoint: string]: Observable<any> } =
    {};
  private cachedProjectSummaries!: Observable<ProjectSummary[]>;

  constructor(private http: HttpClient) {}

  public isProjectValid(
    projectInput: ProjectInput,
    validateSimulationResultsData = false,
    validateIdAvailable = false,
    validateSimulationRunNotPublished = false,
  ): Observable<true | string> {
    return this.http
      .post<void>(
        this.endpoints.getValidateProjectEndpoint(false),
        projectInput,
        {
          headers: { 'Content-Type': 'application/json' },
          params: {
            validateSimulationResultsData,
            validateIdAvailable,
            validateSimulationRunNotPublished,
          },
        },
      )
      .pipe(
        map((): true => true),
        catchError((error: HttpErrorResponse): Observable<string> => {
          if (error.status === HttpStatusCode.BadRequest) {
            return of(error.error.error[0].detail);
          } else {
            return throwError(error);
          }
        }),
        shareReplay(1),
      );
  }

  public publishProject(projectInput: ProjectInput): Observable<void> {
    const url = this.endpoints.getProjectsEndpoint(false, projectInput.id);
    const response = this.http
      .post<void>(url, projectInput, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(shareReplay(1));
    return response;
  }

  public getProject(projectId: string): Observable<Project> {
    const url = this.endpoints.getProjectsEndpoint(false, projectId);
    return this.getData<Project>(projectId, url);
  }

  public getProjectSummaries(): Observable<ProjectSummary[]> {
    const url = this.endpoints.getProjectSummariesEndpoint(false);

    if (!this.cachedProjectSummaries) {
      this.cachedProjectSummaries = this.http
        .get<ProjectSummary[]>(url)
        .pipe(shareReplay(1));
    }

    return this.cachedProjectSummaries;
  }

  public getProjectSummary(projectId: string): Observable<ProjectSummary> {
    const url = this.endpoints.getProjectSummariesEndpoint(false, projectId);
    return this.getData<ProjectSummary>(projectId, url);
  }

  private getData<T>(projectId: string, endpoint: string): Observable<T> {
    if (projectId !== this.cachedProjectId) {
      this.cachedProjectId = projectId;
      this.cachedProjectObservables = {};
    }

    let observable = this.cachedProjectObservables[endpoint];
    if (!observable) {
      observable = this.http.get<any>(endpoint).pipe(shareReplay(1));
      this.cachedProjectObservables[endpoint] = observable;
    }

    return observable as Observable<T>;
  }
}
