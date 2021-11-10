import {
  CombineArchiveLog,
  CreateSimulationRunLogBody,
} from '@biosimulations/datamodel/common';
import { SimulationRun } from '@biosimulations/datamodel/api';
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Endpoints } from '@biosimulations/config/common';
import { AuthClientService } from '@biosimulations/auth/client';
import { pluck, map, mergeMap, retry, catchError } from 'rxjs/operators';
import { from, Observable, throwError } from 'rxjs';
import {
  SimulationRunStatus,
  SimulationRunSedDocument,
  SimulationRunSedDocumentInput,
  SimulationRunSedDocumentInputsContainer,
} from '@biosimulations/datamodel/common';
import {
  ProjectFileInput,
  ProjectFileInputsContainer,
  ProjectFile,
  SimulationRunMetadataInput,
  SimulationRunMetadata,
} from '@biosimulations/datamodel/api';
import { retryBackoff } from 'backoff-rxjs';
import { AxiosError } from 'axios';
@Injectable({})
export class SimulationRunService {
  private endpoints: Endpoints;
  private logger = new Logger(SimulationRunService.name);

  public constructor(
    private auth: AuthClientService,
    private http: HttpService,
    private configService: ConfigService,
  ) {
    const env = this.configService.get('server.env');
    this.endpoints = new Endpoints(env);
  }

  public postMetadata(
    metadata: SimulationRunMetadataInput,
  ): Observable<SimulationRunMetadata> {
    const endpoint = this.endpoints.getSimulationRunMetadataEndpoint();
    return this.postAuthenticated<
      SimulationRunMetadataInput,
      SimulationRunMetadata
    >(endpoint, metadata);
  }

  public postSpecs(
    specs: SimulationRunSedDocumentInput[],
  ): Observable<SimulationRunSedDocument[]> {
    const endpoint = this.endpoints.getSpecificationsEndpoint();
    return this.postAuthenticated<
      SimulationRunSedDocumentInputsContainer,
      SimulationRunSedDocument[]
    >(endpoint, { sedDocuments: specs });
  }

  public postFiles(
    id: string,
    files: ProjectFileInput[],
  ): Observable<ProjectFile[]> {
    const body: ProjectFileInputsContainer = { files };
    const endpoint = this.endpoints.getSimulationRunFilesEndpoint();
    return this.postAuthenticated<ProjectFileInputsContainer, ProjectFile[]>(
      endpoint,
      body,
    );
  }
  public updateSimulationRunStatus(
    id: string,
    status: SimulationRunStatus,
    statusReason: string,
  ): Observable<SimulationRun> {
    const response = from(this.auth.getToken()).pipe(
      map((token) => {
        const httpRes = this.http
          .patch<SimulationRun>(
            this.endpoints.getSimulationRunEndpoint(id),
            {
              status,
              statusReason,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          .pipe(pluck('data'));

        return httpRes;
      }),
      mergeMap((value) => value),
    );
    return response;
  }

  public updateSimulationRunResultsSize(
    id: string,
    size: number,
  ): Observable<SimulationRun> {
    return from(this.auth.getToken()).pipe(
      map((token) => {
        return this.http
          .patch<SimulationRun>(
            this.endpoints.getSimulationRunEndpoint(id),
            { resultsSize: size },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          .pipe(
            catchError((err, caught) => {
              this.logger.error(err);
              return caught;
            }),
            retry(2),
            pluck('data'),
          );
      }),
      mergeMap((value) => value),
    );
  }

  public getJob(id: string): Observable<SimulationRun> {
    return from(this.auth.getToken()).pipe(
      map((token) => {
        return this.http
          .get<SimulationRun>(this.endpoints.getSimulationRunEndpoint(id), {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .pipe(pluck('data'));
      }),
      mergeMap((value) => value),
    );
  }

  public sendLog(
    simId: string,
    log: CombineArchiveLog,
    update = false,
  ): Observable<CombineArchiveLog> {
    if (update) {
      const endpoint = this.endpoints.getSimulationRunLogsEndpoint(simId);
      const body: CombineArchiveLog = log;
      return this.putAuthenticated<CombineArchiveLog, CombineArchiveLog>(
        endpoint,
        body,
      );
    } else {
      const endpoint = this.endpoints.getSimulationRunLogsEndpoint();
      const body: CreateSimulationRunLogBody = {
        simId: simId,
        log: log,
      };
      return this.postAuthenticated<
        CreateSimulationRunLogBody,
        CombineArchiveLog
      >(endpoint, body);
    }
  }

  private postAuthenticated<T, U>(url: string, body: T): Observable<U> {
    const MAX_RETRIES = 12;
    const RetryBackoff = retryBackoff({
      initialInterval: 100,
      maxRetries: MAX_RETRIES,
      resetOnSuccess: true,
    });
    return from(this.auth.getToken()).pipe(
      map((token) => {
        return this.http
          .post<U>(url, body, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .pipe(
            catchError((err: AxiosError, caught) => {
              if (err.isAxiosError) {
                const status = err.response?.status;
                const statusText = err.response?.statusText;
                const message = err.response?.data?.message;
                this.logger.error(
                  `${status} ${statusText} ${message} for post operation on path ${url}`,
                );
              } else {
                this.logger.error(err);
              }

              return throwError(() => err);
            }),
            RetryBackoff,
            pluck('data'),
          );
      }),
      mergeMap((value) => value),
    );
  }

  private putAuthenticated<T, U>(url: string, body: T): Observable<U> {
    return from(this.auth.getToken()).pipe(
      map((token) => {
        return this.http
          .put<U>(url, body, {
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
