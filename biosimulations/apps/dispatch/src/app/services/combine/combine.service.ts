import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { urls } from '@biosimulations/config/common';
import { environment } from '@biosimulations/shared/environments';
import { CombineArchive } from '../../combine-sedml.interface';
import { ValidationReport } from '../../validation-report.interface';
import { AlgorithmSubstitution } from '../../kisao.interface';

@Injectable({
  providedIn: 'root',
})
export class CombineService {
  private sedmlSpecsEndpoint = `${urls.combineApi}combine/sedml-specs`;
  private validateEndpoint = `${urls.combineApi}combine/validate`;
  private similarAlgorithmsEndpoint = `${urls.combineApi}kisao/get-similar-algorithms`;

  public constructor(private http: HttpClient) {}

  public getSpecsOfSedDocsInCombineArchive(
    archiveFileOrUrl: File | string,
  ): Observable<CombineArchive | undefined> {
    const formData = new FormData();
    if (typeof archiveFileOrUrl === "object") {
      formData.append('file', archiveFileOrUrl);
    } else {
      formData.append('url', archiveFileOrUrl);
    }

    return this.http
      .post<CombineArchive>(this.sedmlSpecsEndpoint, formData)
      .pipe(
        catchError(
          (error: HttpErrorResponse): Observable<undefined> => {
            if (!environment.production) {
              console.error(error);
            }
            return of<undefined>(undefined);
          },
        ),
      );
  }

  public validateCombineArchive(
    archiveFileOrUrl: File | string,
  ): Observable<ValidationReport | undefined> {
    const formData = new FormData();
    if (typeof archiveFileOrUrl === "object") {
      formData.append('file', archiveFileOrUrl);
    } else {
      formData.append('url', archiveFileOrUrl);
    }

    return this.http
      .post<ValidationReport>(this.validateEndpoint, formData)
      .pipe(
        catchError(
          (error: HttpErrorResponse): Observable<undefined> => {
            if (!environment.production) {
              console.error(error);
            }
            return of<undefined>(undefined);
          },
        ),
      );
  }

  public getSimilarAlgorithms(
    algorithms: string[],
  ): Observable<AlgorithmSubstitution[] | undefined> {

    const params = new HttpParams().appendAll({algorithms: algorithms});

    return this.http
      .get<AlgorithmSubstitution[]>(this.similarAlgorithmsEndpoint, {params: params})
      .pipe(
        catchError(
          (error: HttpErrorResponse): Observable<undefined> => {
            if (!environment.production) {
              console.error(error);
            }
            return of<undefined>(undefined);
          },
        ),
      );
  }
}
