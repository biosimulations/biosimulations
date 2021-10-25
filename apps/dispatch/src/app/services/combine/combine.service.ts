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
import {
  CombineArchiveSedDocSpecs,
  OmexMetadataInputFormat,
  OmexMetadataSchema,
  ModelLanguage,
} from '@biosimulations/datamodel/common';
import { CombineArchiveElementMetadata } from '../../datamodel/metadata.interface';
import { ValidationReport } from '../../datamodel/validation-report.interface';
import { AlgorithmSubstitution } from '../../kisao.interface';

@Injectable({
  providedIn: 'root',
})
export class CombineService {
  private sedmlSpecsEndpoint = `${urls.combineApi}combine/sedml-specs`;
  private archiveMetadataEndpoint = `${urls.combineApi}combine/metadata/biosimulations`;
  private validateModelEndpoint = `${urls.combineApi}model/validate`;
  private validateSimulationEndpoint = `${urls.combineApi}sed-ml/validate`;
  private validateMetadataEndpoint = `${urls.combineApi}omex-metadata/validate`;
  private validateProjectEndpoint = `${urls.combineApi}combine/validate`;
  private similarAlgorithmsEndpoint = `${urls.combineApi}kisao/get-similar-algorithms`;

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
      );
  }

  public getCombineArchiveMetadata(
    fileOrUrl: File | string,
    format: OmexMetadataInputFormat = OmexMetadataInputFormat.rdfxml,
  ): Observable<
    CombineArchiveElementMetadata[] | ValidationReport | undefined
  > {
    const formData = new FormData();
    if (typeof fileOrUrl === 'object') {
      formData.append('file', fileOrUrl);
    } else {
      formData.append('url', fileOrUrl);
    }
    formData.append('omexMetadataFormat', format);

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

  public validateModel(
    fileOrUrl: File | string,
    language: ModelLanguage,
  ): Observable<ValidationReport | undefined> {
    const formData = new FormData();
    if (typeof fileOrUrl === 'object') {
      formData.append('file', fileOrUrl);
    } else {
      formData.append('url', fileOrUrl);
    }

    formData.append('language', language);

    return this.http
      .post<ValidationReport>(this.validateModelEndpoint, formData)
      .pipe(
        catchError((error: HttpErrorResponse): Observable<undefined> => {
          if (!environment.production) {
            console.error(error);
          }
          return of<undefined>(undefined);
        }),
      );
  }

  public validateSimulation(
    fileOrUrl: File | string,
  ): Observable<ValidationReport | undefined> {
    const formData = new FormData();
    if (typeof fileOrUrl === 'object') {
      formData.append('file', fileOrUrl);
    } else {
      formData.append('url', fileOrUrl);
    }

    return this.http
      .post<ValidationReport>(this.validateSimulationEndpoint, formData)
      .pipe(
        catchError((error: HttpErrorResponse): Observable<undefined> => {
          if (!environment.production) {
            console.error(error);
          }
          return of<undefined>(undefined);
        }),
      );
  }

  public validateMetadata(
    fileOrUrl: File | string,
    format: OmexMetadataInputFormat = OmexMetadataInputFormat.rdfxml,
    schema: OmexMetadataSchema = OmexMetadataSchema.BioSimulations,
  ): Observable<ValidationReport | undefined> {
    const formData = new FormData();
    if (typeof fileOrUrl === 'object') {
      formData.append('file', fileOrUrl);
    } else {
      formData.append('url', fileOrUrl);
    }

    formData.append('format', format);
    formData.append('schema', schema);

    return this.http
      .post<ValidationReport>(this.validateMetadataEndpoint, formData)
      .pipe(
        catchError((error: HttpErrorResponse): Observable<undefined> => {
          if (!environment.production) {
            console.error(error);
          }
          return of<undefined>(undefined);
        }),
      );
  }

  public validateProject(
    fileOrUrl: File | string,
    omexMetadataFormat: OmexMetadataInputFormat = OmexMetadataInputFormat.rdfxml,
    omexMetadataSchema: OmexMetadataSchema = OmexMetadataSchema.BioSimulations,
    validateOmexManifest = true,
    validateSedml = true,
    validateSedmlModels = true,
    validateOmexMetadata = true,
    validateImages = true,
  ): Observable<ValidationReport | undefined> {
    const formData = new FormData();
    if (typeof fileOrUrl === 'object') {
      formData.append('file', fileOrUrl);
    } else {
      formData.append('url', fileOrUrl);
    }

    formData.append('omexMetadataFormat', omexMetadataFormat);
    formData.append('omexMetadataSchema', omexMetadataSchema);
    formData.append(
      'validateOmexManifest',
      validateOmexManifest ? 'true' : 'false',
    );
    formData.append('validateSedml', validateSedml ? 'true' : 'false');
    formData.append(
      'validateSedmlModels',
      validateSedmlModels ? 'true' : 'false',
    );
    formData.append(
      'validateOmexMetadata',
      validateOmexMetadata ? 'true' : 'false',
    );
    formData.append('validateImages', validateImages ? 'true' : 'false');

    return this.http
      .post<ValidationReport>(this.validateProjectEndpoint, formData)
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
