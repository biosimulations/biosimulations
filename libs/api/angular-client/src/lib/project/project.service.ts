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

  private projectSummaries!: Observable<ProjectSummary[]>;

  constructor(private http: HttpClient) {}

  public isProjectValid(
    projectInput: ProjectInput,
    validateSimulationResultsData = false,
    validateIdAvailable = false,
    validateSimulationRunNotPublished = false,
  ): Observable<true | string> {
    return this.http
      .post<void>(this.endpoints.getValidateProjectEndpoint(), projectInput, {
        headers: { 'Content-Type': 'application/json' },
        params: {
          validateSimulationResultsData,
          validateIdAvailable,
          validateSimulationRunNotPublished,
        },
      })
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

  public publishProject(projectInput: ProjectInput): Observable<Project> {
    const url = this.endpoints.getProjectsEndpoint();
    const response = this.http
      .post<Project>(url, projectInput, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(shareReplay(1));
    return response;
  }

  public getProject(projectId: string): Observable<Project> {
    const url = this.endpoints.getProjectsEndpoint(projectId);
    const response = this.http.get<Project>(url).pipe(shareReplay(1));
    return response;
  }

  public getProjectSummaries(): Observable<ProjectSummary[]> {
    const url = this.endpoints.getProjectSummariesEndpoint();

    if (!this.projectSummaries) {
      this.projectSummaries = this.http.get<ProjectSummary[]>(url).pipe(shareReplay(1));
    }

    return this.projectSummaries;
  }

  public getProjectSummary(projectId: string): Observable<ProjectSummary> {
    const url = this.endpoints.getProjectSummariesEndpoint(projectId);
    const response = this.http.get<ProjectSummary>(url).pipe(shareReplay(1));
    return response;
  }
}
