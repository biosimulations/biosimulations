import {
  CombineArchiveLog,
  ThumbnailUrls,
} from '@biosimulations/datamodel/common';
import { ProjectFile, SimulationRun } from '@biosimulations/datamodel/api';
import { Injectable, Logger, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Endpoints } from '@biosimulations/config/common';
import { AuthClientService } from '@biosimulations/auth/client';
import { pluck, map, mergeMap, catchError } from 'rxjs/operators';
import { from, Observable, throwError, OperatorFunction } from 'rxjs';

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
import axios, { AxiosError, AxiosResponse } from 'axios';

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
  ): Observable<void> {
    this.logger.log(
      `Uploading simulation experiment specifications (SED-ML) for simulation run '${runId}' ....`,
    );
    const endpoint =
      this.endpoints.getSimulationRunSimulationExperimentSpecificationsEndpoint(
        false,
        runId,
      );
    return this.postAuthenticated<
      SimulationRunSedDocumentInputsContainer,
      void
    >(runId, endpoint, { sedDocuments: specs });
  }

  public postFiles(
    runId: string,
    files: ProjectFileInput[],
  ): Observable<ProjectFile[]> {
    this.logger.log(`Uploading files for simulation run '${runId}' ....`);
    const endpoint = this.endpoints.getSimulationRunFilesEndpoint(false, runId);
    const body: ProjectFileInputsContainer = { files: files };
    return this.postAuthenticated<ProjectFileInputsContainer, ProjectFile[]>(
      runId,
      endpoint,
      body,
    );
  }

  public putFileThumbnailUrls(
    runId: string,
    fileId: string,
    thumbnailUrls: ThumbnailUrls,
  ): Observable<ThumbnailUrls> {
    this.logger.log(`Uploading thumbnailUrls for file ${runId}/${fileId}`);

    const endpoint = this.endpoints.getSimulationRunThumbnailEndpoint(
      false,
      runId,
      fileId,
    );
    const returnVal = this.putAuthenticated<ThumbnailUrls, undefined>(
      runId,
      endpoint,
      thumbnailUrls,
    ).pipe(
      // Just for documentation
      map((val: any) => {
        this.logger.log(`Uploaded thumbnailUrls for file ${runId}/${fileId}`);
        return thumbnailUrls;
      }),
    );

    return returnVal;
  }

  public updateSimulationRunStatus(
    runId: string,
    status: SimulationRunStatus,
  ): Observable<SimulationRun> {
    const endpoint = this.endpoints.getSimulationRunEndpoint(false, runId);
    type SimulationRunStatusPatch = {
      status: SimulationRunStatus;
    };
    const response = this.patchAuthenticated<
      SimulationRunStatusPatch,
      SimulationRun
    >(runId, endpoint, { status });
    return response;
  }

  public updateSimulationRunResultsSize(
    runId: string,
    size: number,
    // todo send url to api
    url: string,
  ): Observable<SimulationRun> {
    const endPointurl = this.endpoints.getSimulationRunEndpoint(false, runId);
    const response = this.patchAuthenticated<
      { resultsSize: number },
      SimulationRun
    >(runId, endPointurl, { resultsSize: size });
    return response;
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

  private patchAuthenticated<T, U>(
    runId: string,
    url: string,
    body: T,
  ): Observable<U> {
    const response = from(this.auth.getToken()).pipe(
      map((token) => {
        const httpRes = this.http
          .patch<U>(url, body, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .pipe(
            this.getErrorHandler<U>('Patch', url, runId),
            this.getRetryBackoff(),
            pluck('data'),
          );

        return httpRes;
      }),
      mergeMap((value) => value),
    );
    return response;
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
            this.getErrorHandler<U>('Post', url, runId),
            this.getRetryBackoff(),
            pluck('data'),
          );
      }),
      mergeMap((value) => value),
    );
  }

  private getErrorHandler<U>(
    method: string,
    url: string,
    runId: string,
  ): OperatorFunction<AxiosResponse<U, any>, AxiosResponse<U, any>> {
    const handler = catchError(
      (err: unknown, caught: Observable<AxiosResponse<U, any>>) => {
        if (axios.isAxiosError(err)) {
          const name = err.name;
          const message = err.message;
          this.logger.error(
            `${name} ${message} for ${method} operation on path ${url} for simulation run ${runId}`,
          );
        } else {
          this.logger.error(
            `The ${method} operation to ${url} for simulation run ${runId} failed: ${err}`,
          );
        }

        return throwError(() => err);
      },
    );
    return handler;
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
            this.getErrorHandler<U>('Put', url, runId),
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
