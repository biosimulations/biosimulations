import { CombineArchiveLog } from '@biosimulations/datamodel/common';
import { SimulationRun } from '@biosimulations/datamodel/api';
import { Injectable, Logger, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Endpoints } from '@biosimulations/config/common';
import { AuthClientService } from '@biosimulations/auth/client';
import { pluck, map, mergeMap, retry, catchError } from 'rxjs/operators';
import { from, Observable, throwError, forkJoin } from 'rxjs';
import {
  SimulationRunStatus,
  SimulationRunSedDocumentInput,
  SimulationRunSedDocumentInputsContainer,
} from '@biosimulations/datamodel/common';
import {
  ProjectFileInput,
  ProjectFileInputsContainer,
  ArchiveMetadataContainer,
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
    runId: string,
    metadata: ArchiveMetadataContainer,
  ): Observable<void> {
    this.logger.log(`Uploading metadata for simulation run '${runId}' ....`);
    const endpoint = this.endpoints.getSimulationRunMetadataEndpoint(
      false,
      runId,
    );
    return this.postAuthenticated<ArchiveMetadataContainer, void>(
      runId,
      endpoint,
      metadata,
    );
  }

  public postSpecs(
    runId: string,
    specs: SimulationRunSedDocumentInput[],
  ): Observable<void[]> {
    this.logger.log(
      `Uploading simulation experiment specifications (SED-ML) for simulation run '${runId}' ....`,
    );
    const endpoint =
      this.endpoints.getSimulationRunSimulationExperimentSpecificationsEndpoint(
        false,
        runId,
      );
    return forkJoin(
      specs.map((spec: SimulationRunSedDocumentInput): Observable<void> => {
        return this.postAuthenticated<
          SimulationRunSedDocumentInputsContainer,
          void
        >(runId, endpoint, { sedDocuments: [spec] });
      })
    );
  }

  public postFiles(runId: string, files: ProjectFileInput[]): Observable<void[]> {
    this.logger.log(`Uploading files for simulation run '${runId}' ....`);
    const endpoint = this.endpoints.getSimulationRunFilesEndpoint(false, runId);
    return forkJoin(
      files.map((file: ProjectFileInput): Observable<void> => {
        const body: ProjectFileInputsContainer = { files: [file] };
        return this.postAuthenticated<ProjectFileInputsContainer, void>(
          runId,
          endpoint,
          body,
        );
      })
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
            this.endpoints.getSimulationRunEndpoint(false, runId),
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
            this.endpoints.getSimulationRunEndpoint(false, runId),
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
          .get<SimulationRun>(
            this.endpoints.getSimulationRunEndpoint(false, runId),
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          .pipe(this.getRetryBackoff(), pluck('data'));
      }),
      mergeMap((value) => value),
    );
  }

  public sendLog(
    runId: string,
    log: CombineArchiveLog,
    update = false,
  ): Observable<void> {
    const endpoint = this.endpoints.getSimulationRunLogsEndpoint(false, runId);
    if (update) {
      const body: CombineArchiveLog = log;
      return this.putAuthenticated<CombineArchiveLog, void>(
        runId,
        endpoint,
        body,
      );
    } else {
      return this.postAuthenticated<CombineArchiveLog, void>(
        runId,
        endpoint,
        log,
      );
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
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .pipe(
            catchError((err: AxiosError, caught) => {
              if (err.isAxiosError) {
                const name = err.name;
                const message = err.message;
                this.logger.error(
                  `${name} ${message} for post operation on path ${url} for simulation run ${runId}`,
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
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .pipe(
            catchError((err: AxiosError, caught) => {
              if (err.isAxiosError) {
                const name = err.name;
                const message = err.message;
                this.logger.error(
                  `${name} ${message} for put operation on path ${url} for simulation run ${runId}`,
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
      shouldRetry: (error: AxiosError): boolean => {
        return (
          error.isAxiosError &&
          [
            HttpStatus.REQUEST_TIMEOUT,
            HttpStatus.INTERNAL_SERVER_ERROR,
            HttpStatus.BAD_GATEWAY,
            HttpStatus.GATEWAY_TIMEOUT,
            HttpStatus.SERVICE_UNAVAILABLE,
            HttpStatus.TOO_MANY_REQUESTS,
            undefined,
            null,
          ].includes(error?.response?.status)
        );
      },
    });
  }
}
