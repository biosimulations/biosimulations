import {
  CombineArchiveLog,
  CreateSimulationRunLogBody,
} from '@biosimulations/datamodel/common';
import { SimulationRun } from '@biosimulations/datamodel/api';
import { Injectable, Logger, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
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
  ) {
    this.endpoints = new Endpoints();
  }

  public postMetadata(
    runId: string,
    metadata: SimulationRunMetadataInput,
  ): Observable<SimulationRunMetadata> {
    this.logger.log(`Uploading metadata for simulation run '${runId}' ....`);
    const endpoint = this.endpoints.getSimulationRunMetadataEndpoint();
    return this.postAuthenticated<
      SimulationRunMetadataInput,
      SimulationRunMetadata
    >(runId, endpoint, metadata);
  }

  public postSpecs(
    runId: string,
    specs: SimulationRunSedDocumentInput[],
  ): Observable<SimulationRunSedDocument[]> {
    this.logger.log(
      `Uploading simulation experiment specifications (SED-ML) for simulation run '${runId}' ....`,
    );
    const endpoint = this.endpoints.getSpecificationsEndpoint();
    return this.postAuthenticated<
      SimulationRunSedDocumentInputsContainer,
      SimulationRunSedDocument[]
    >(runId, endpoint, { sedDocuments: specs });
  }

  public postFiles(
    runId: string,
    files: ProjectFileInput[],
  ): Observable<ProjectFile[]> {
    this.logger.log(`Uploading files for simulation run '${runId}' ....`);
    const body: ProjectFileInputsContainer = { files };
    const endpoint = this.endpoints.getSimulationRunFilesEndpoint();
    return this.postAuthenticated<ProjectFileInputsContainer, ProjectFile[]>(
      runId,
      endpoint,
      body,
    );
  }

  public updateSimulationRunStatus(
    runId: string,
    status: SimulationRunStatus,
    statusReason: string,
  ): Observable<SimulationRun> {
    const response = from(this.auth.getToken()).pipe(
      map((token) => {
        const httpRes = this.http
          .patch<SimulationRun>(
            this.endpoints.getSimulationRunEndpoint(runId),
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
          .pipe(this.getRetryBackoff(), pluck('data'));

        return httpRes;
      }),
      mergeMap((value) => value),
    );
    return response;
  }

  public updateSimulationRunResultsSize(
    runId: string,
    size: number,
  ): Observable<SimulationRun> {
    return from(this.auth.getToken()).pipe(
      map((token) => {
        return this.http
          .patch<SimulationRun>(
            this.endpoints.getSimulationRunEndpoint(runId),
            { resultsSize: size },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          .pipe(
            catchError((error, caught) => {
              this.logger.error(
                `The size of the results for simulation run '${runId}' could not be updated: ${error}`,
              );
              return caught;
            }),
            retry(5),
            pluck('data'),
          );
      }),
      mergeMap((value) => value),
    );
  }

  public getSimulationRun(runId: string): Observable<SimulationRun> {
    return from(this.auth.getToken()).pipe(
      map((token) => {
        return this.http
          .get<SimulationRun>(this.endpoints.getSimulationRunEndpoint(runId), {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .pipe(this.getRetryBackoff(), pluck('data'));
      }),
      mergeMap((value) => value),
    );
  }

  public sendLog(
    runId: string,
    log: CombineArchiveLog,
    update = false,
  ): Observable<CombineArchiveLog> {
    if (update) {
      const endpoint = this.endpoints.getSimulationRunLogsEndpoint(runId);
      const body: CombineArchiveLog = log;
      return this.putAuthenticated<CombineArchiveLog, CombineArchiveLog>(
        runId,
        endpoint,
        body,
      );
    } else {
      const endpoint = this.endpoints.getSimulationRunLogsEndpoint();
      const body: CreateSimulationRunLogBody = {
        simId: runId,
        log: log,
      };
      return this.postAuthenticated<
        CreateSimulationRunLogBody,
        CombineArchiveLog
      >(runId, endpoint, body);
    }
  }

  private postAuthenticated<T, U>(
    runId: string,
    url: string,
    body: T,
  ): Observable<U> {
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
                  `${status} ${statusText} ${message} for post operation on path ${url} for simulation run ${runId}`,
                );
              } else {
                this.logger.error(
                  `The post operation to ${url} for simulation run ${runId} failed: ${err}`,
                );
              }

              return throwError(() => err);
            }),
            this.getRetryBackoff(),
            pluck('data'),
          );
      }),
      mergeMap((value) => value),
    );
  }

  private putAuthenticated<T, U>(
    runId: string,
    url: string,
    body: T,
  ): Observable<U> {
    return from(this.auth.getToken()).pipe(
      map((token) => {
        return this.http
          .put<U>(url, body, {
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
                  `${status} ${statusText} ${message} for put operation on path ${url} for simulation run ${runId}`,
                );
              } else {
                this.logger.error(
                  `The put operation to ${url} for simulation run ${runId} failed: ${err}`,
                );
              }

              return throwError(() => err);
            }),
            this.getRetryBackoff(),
            pluck('data'),
          );
      }),
      mergeMap((value) => value),
    );
  }

  private getRetryBackoff(): <T>(source: Observable<T>) => Observable<T> {
    return retryBackoff({
      initialInterval: 100,
      maxRetries: 12,
      resetOnSuccess: true,
      shouldRetry: (error: any): boolean => {
        return [
          HttpStatus.REQUEST_TIMEOUT,
          HttpStatus.INTERNAL_SERVER_ERROR,
          HttpStatus.BAD_GATEWAY,
          HttpStatus.GATEWAY_TIMEOUT,
          HttpStatus.SERVICE_UNAVAILABLE,
          HttpStatus.TOO_MANY_REQUESTS,
          undefined,
          null,
        ].includes(error?.status);
      },
    });
  }
}
