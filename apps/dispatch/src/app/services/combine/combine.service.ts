import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { urls } from '@biosimulations/config/common';
import { environment } from '@biosimulations/shared/environments';
import { CombineArchive, OmexMetadataInputFormat, OmexMetadataSchema } from '@biosimulations/datamodel/common';
import { CombineArchiveElementMetadata } from '../../datamodel/metadata.interface';
import { ValidationReport } from '../../datamodel/validation-report.interface';
import { AlgorithmSubstitution } from '../../kisao.interface';

@Injectable({
  providedIn: 'root',
})
export class CombineService {
  private sedmlSpecsEndpoint = `${urls.combineApi}combine/sedml-specs`;
  private archiveMetadataEndpoint = `${urls.combineApi}combine/metadata/biosimulations`;
  private validateEndpoint = `${urls.combineApi}combine/validate`;
  private similarAlgorithmsEndpoint = `${urls.combineApi}kisao/get-similar-algorithms`;

  public constructor(private http: HttpClient) {}

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
    omexMetadataFormat: OmexMetadataInputFormat = OmexMetadataInputFormat.rdfxml,
  ): Observable<
    CombineArchiveElementMetadata[] | ValidationReport | undefined
  > {
    const formData = new FormData();
    if (typeof archiveFileOrUrl === 'object') {
      formData.append('file', archiveFileOrUrl);
    } else {
      formData.append('url', archiveFileOrUrl);
    }
    formData.append('omexMetadataFormat', omexMetadataFormat);

    return this.http
      .post<CombineArchiveElementMetadata[]>(
        this.archiveMetadataEndpoint,
        formData,
      )
      .pipe(
        catchError(
          (
            error: HttpErrorResponse,
          ): Observable<ValidationReport | undefined> => {
            if (error?.error?.validationReport) {
              return of<ValidationReport>(
                error?.error?.validationReport as ValidationReport,
              );
            }

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
    omexMetadataFormat: OmexMetadataInputFormat = OmexMetadataInputFormat.rdfxml,
    omexMetadataSchema: OmexMetadataSchema = OmexMetadataSchema.BioSimulations,
    validateOmexManifest = true,
    validateSedml = true,
    validateSedmlModels = true,
    validateOmexMetadata = true,
    validateImages = true,
  ): Observable<ValidationReport | undefined> {
    const formData = new FormData();
    if (typeof archiveFileOrUrl === 'object') {
      formData.append('file', archiveFileOrUrl);
    } else {
      formData.append('url', archiveFileOrUrl);
    }

    formData.append('omexMetadataFormat', omexMetadataFormat);
    formData.append('omexMetadataSchema', omexMetadataSchema);
    formData.append('validateOmexManifest', validateOmexManifest ? 'true' : 'false');
    formData.append('validateSedml', validateSedml ? 'true' : 'false');
    formData.append('validateSedmlModels', validateSedmlModels ? 'true' : 'false');
    formData.append('validateOmexMetadata', validateOmexMetadata ? 'true' : 'false');
    formData.append('validateImages', validateImages ? 'true' : 'false');

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
        timeout(2500),
        catchError((error: HttpErrorResponse): Observable<undefined> => {
          if (!environment.production) {
            console.error(error);
          }
          return of<undefined>(undefined);
        }),
      );
  }
}
