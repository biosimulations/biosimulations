import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { urls } from '@biosimulations/config/common';
import { environment } from '@biosimulations/shared/environments';
import { CombineArchive } from '../../combine-sedml.interface';
import { CombineArchiveElementMetadata } from '../../metadata.interface';
import { ValidationReport } from '../../validation-report.interface';
import { AlgorithmSubstitution } from '../../kisao.interface';

@Injectable({
  providedIn: 'root',
})
export class CombineService {
  private archiveManifestEndpoint = `${urls.combineApi}combine/manifest`;
  private sedmlSpecsEndpoint = `${urls.combineApi}combine/sedml-specs`;
  private archiveMetadataEndpoint = `${urls.combineApi}combine/metadata/biosimulations`;
  private validateEndpoint = `${urls.combineApi}combine/validate`;
  private similarAlgorithmsEndpoint = `${urls.combineApi}kisao/get-similar-algorithms`;
  private fileInCombineArchiveEndpoint = `${urls.combineApi}combine/file`;

  public constructor(private http: HttpClient) {}

  public getCombineArchiveManifest(
    archiveFileOrUrl: File | string,
  ): Observable<CombineArchive | undefined> {
    const formData = new FormData();
    if (typeof archiveFileOrUrl === 'object') {
      formData.append('file', archiveFileOrUrl);
    } else {
      formData.append('url', archiveFileOrUrl);
    }

    return this.http
      .post<CombineArchive>(this.archiveManifestEndpoint, formData)
      .pipe(
        catchError((error: HttpErrorResponse): Observable<undefined> => {
          if (!environment.production) {
            console.error(error);
          }
          return of<undefined>(undefined);
        }),
      );
  }

  public getSpecsOfSedDocsInCombineArchive(
    archiveFileOrUrl: File | string,
  ): Observable<CombineArchive | undefined> {
    const formData = new FormData();
    if (typeof archiveFileOrUrl === 'object') {
      formData.append('file', archiveFileOrUrl);
    } else {
      formData.append('url', archiveFileOrUrl);
    }

    return this.http
      .post<CombineArchive>(this.sedmlSpecsEndpoint, formData)
      .pipe(
        catchError((error: HttpErrorResponse): Observable<undefined> => {
          if (!environment.production) {
            console.error(error);
          }
          return of<undefined>(undefined);
        }),
      );
  }

  public getCombineArchiveMetadata(
    archiveFileOrUrl: File | string,
  ): Observable<CombineArchiveElementMetadata[] | undefined> {
    const formData = new FormData();
    if (typeof archiveFileOrUrl === 'object') {
      formData.append('file', archiveFileOrUrl);
    } else {
      formData.append('url', archiveFileOrUrl);
    }

    return this.http
      .post<CombineArchiveElementMetadata[]>(
        this.archiveMetadataEndpoint,
        formData,
      )
      .pipe(
        catchError((error: HttpErrorResponse): Observable<undefined> => {
          if (!environment.production) {
            console.error(error);
          }
          return of<undefined>(undefined);
        }),
      );
  }

  public validateCombineArchive(
    archiveFileOrUrl: File | string,
  ): Observable<ValidationReport | undefined> {
    const formData = new FormData();
    if (typeof archiveFileOrUrl === 'object') {
      formData.append('file', archiveFileOrUrl);
    } else {
      formData.append('url', archiveFileOrUrl);
    }

    return this.http
      .post<ValidationReport>(this.validateEndpoint, formData)
      .pipe(
        catchError((error: HttpErrorResponse): Observable<undefined> => {
          if (!environment.production) {
            console.error(error);
          }
          return of<undefined>(undefined);
        }),
      );
  }

  public getSimilarAlgorithms(
    algorithms: string[],
  ): Observable<AlgorithmSubstitution[] | undefined> {
    const params = new HttpParams().appendAll({ algorithms: algorithms });

    return this.http
      .get<AlgorithmSubstitution[]>(this.similarAlgorithmsEndpoint, {
        params: params,
      })
      .pipe(
        catchError((error: HttpErrorResponse): Observable<undefined> => {
          if (!environment.production) {
            console.error(error);
          }
          return of<undefined>(undefined);
        }),
      );
  }

  public addFileToCombineArchive(
    archiveFileOrUrl: File | string,
    newContentLocation: string,
    newContentFormat: string,
    newContentMaster: boolean,
    newContentFile: Blob,
    overwriteLocations = false,
  ): Observable<ArrayBuffer | string | undefined> {
    const formData = new FormData();

    if (typeof archiveFileOrUrl === 'object') {
      formData.append('files', archiveFileOrUrl);
      formData.append(
        'archive',
        JSON.stringify({ filename: archiveFileOrUrl.name }),
      );
    } else {
      formData.append('archive', JSON.stringify({ url: archiveFileOrUrl }));
    }

    const newContentFilename = '__new_content__';
    formData.append('files', newContentFile, newContentFilename);

    formData.append(
      'newContent',
      JSON.stringify({
        _type: 'CombineArchiveContent',
        location: newContentLocation,
        format: newContentFormat,
        master: newContentMaster,
        filename: newContentFilename,
      }),
    );

    formData.append('overwriteLocations', JSON.stringify(overwriteLocations));
    formData.append('download', JSON.stringify(false));

    const headers = {
      Accept: 'application/zip',
    };

    return this.http
      .post<string>(this.fileInCombineArchiveEndpoint, formData, {
        headers: headers,
        responseType: 'json',
      })
      .pipe(
        catchError((error: HttpErrorResponse): Observable<undefined> => {
          if (!environment.production) {
            console.error(error);
          }
          return of<undefined>(undefined);
        }),
      );
  }

  public getFileInCombineArchive(
    url: string,
    location: string,
  ): Observable<any | undefined> {
    const params = new HttpParams().appendAll({ url, location });

    return this.http
      .get<any>(this.fileInCombineArchiveEndpoint, {
        params: params,
      })
      .pipe(
        catchError((error: HttpErrorResponse): Observable<undefined> => {
          if (!environment.production) {
            console.error(error);
          }
          return of<undefined>(undefined);
        }),
      );
  }
}
