import { Project, ProjectInput } from '@biosimulations/datamodel/api';
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Endpoints } from '@biosimulations/config/common';
import { AuthClientService } from '@biosimulations/auth/client';
import { pluck, map, mergeMap } from 'rxjs/operators';
import { from, Observable } from 'rxjs';

@Injectable({})
export class ProjectService {
  private endpoints: Endpoints;
  private logger = new Logger(ProjectService.name);

  public constructor(
    private auth: AuthClientService,
    private http: HttpService,
    private configService: ConfigService,
  ) {
    const env = this.configService.get('server.env');
    this.endpoints = new Endpoints(env);
  }

  public getProject(id: string): Observable<Project> {
    return from(this.auth.getToken()).pipe(
      map((token) => {
        return this.http
          .get<Project>(this.endpoints.getProjectsEndpoint(id), {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .pipe(pluck('data'));
      }),
      mergeMap((value) => value),
    );
  }

  public createProject(project: ProjectInput): Observable<Project> {
    const endpoint = this.endpoints.getProjectsEndpoint();
    return this.postAuthenticated<ProjectInput, Project>(endpoint, project);
  }

  public updateProject(id: string, project: ProjectInput): Observable<Project> {
    const response = from(this.auth.getToken()).pipe(
      map((token) => {
        const httpRes = this.http
          .put<Project>(this.endpoints.getProjectsEndpoint(id), project, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .pipe(pluck('data'));

        return httpRes;
      }),
      mergeMap((value) => value),
    );
    return response;
  }

  private postAuthenticated<T, U>(url: string, body: T): Observable<U> {
    return from(this.auth.getToken()).pipe(
      map((token) => {
        return this.http
          .post<U>(url, body, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .pipe(pluck('data'));
      }),
      mergeMap((value) => value),
    );
  }
}
