import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, timeout, shareReplay, retryWhen } from 'rxjs/operators';
import { environment } from '@biosimulations/shared/environments';
import {
  CombineArchiveSedDocSpecs,
  AlgorithmSubstitution,
} from '@biosimulations/datamodel/common';
import { Endpoints } from '@biosimulations/config/common';
import { RetryStrategy } from '@biosimulations/shared/angular';

@Injectable({
  providedIn: 'root',
})
export class CombineApiService {
  private endpoints = new Endpoints();

  private sedmlSpecsEndpoint =
    this.endpoints.getSedmlSpecificationsEndpoint(true);
  private similarAlgorithmsEndpoint =
    this.endpoints.getSimilarAlgorithmsEndpoint(true);

  public constructor(private http: HttpClient) {}

  public getSpecsOfSedDocsInCombineArchive(
    fileOrUrl: File | string,
  ): Observable<CombineArchiveSedDocSpecs | undefined> {
    const formData = new FormData();
    if (typeof fileOrUrl === 'object') {
      formData.append('file', fileOrUrl);
    } else {
      formData.append('url', fileOrUrl);
    }

    return this.http
      .post<CombineArchiveSedDocSpecs>(this.sedmlSpecsEndpoint, formData)
      .pipe(
        catchError((error: HttpErrorResponse): Observable<undefined> => {
          if (!environment.production) {
            console.error(error);
          }
          return of<undefined>(undefined);
        }),
        shareReplay(1),
      );
  }

  private similarAlgorithmsCache: {
    [algorithms: string]: Observable<AlgorithmSubstitution[] | undefined>;
  } = {};

  public getSimilarAlgorithms(
    algorithms: string[],
  ): Observable<AlgorithmSubstitution[] | undefined> {
    const algorithmsStrList = algorithms.join('&');
    let observable: Observable<AlgorithmSubstitution[] | undefined> =
      this.similarAlgorithmsCache[algorithmsStrList];

    if (!observable) {
      const params = new HttpParams().appendAll({ algorithms: algorithms });
      const retryStrategy = new RetryStrategy(6, 5000);

      observable = this.http
        .get<AlgorithmSubstitution[]>(this.similarAlgorithmsEndpoint, {
          params: params,
        })
        .pipe(
          timeout(2500),
          retryWhen(retryStrategy.handler.bind(retryStrategy)),
          catchError((error: HttpErrorResponse): Observable<undefined> => {
            if (!environment.production) {
              console.error(error);
            }
            return of<undefined>(undefined);
          }),
          shareReplay(1),
        );
      this.similarAlgorithmsCache[algorithmsStrList] = observable;
    }

    return observable;
  }
}
