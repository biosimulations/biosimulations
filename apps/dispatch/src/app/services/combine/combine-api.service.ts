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
  OmexMetadataInputFormat,
  OmexMetadataSchema,
  ModelLanguage,
} from '@biosimulations/datamodel/common';
import { ValidationReport } from '../../datamodel/validation-report.interface';
import { AlgorithmSubstitution } from '../../kisao.interface';
import { Endpoints } from '@biosimulations/config/common';
import { RetryStrategy } from '@biosimulations/shared/angular';

@Injectable({
  providedIn: 'root',
})
export class CombineApiService {
  private endpoints = new Endpoints();

  private sedmlSpecsEndpoint =
    this.endpoints.getSedmlSpecificationsEndpoint(true);
  private validateModelEndpoint = this.endpoints.getValidateModelEndpoint(true);
  private validateSimulationEndpoint =
    this.endpoints.getValidateSedmlEndpoint(true);
  private validateMetadataEndpoint =
    this.endpoints.getValidateOmexMetadataEndpoint(true);
  private validateProjectEndpoint =
    this.endpoints.getValidateCombineArchiveEndpoint(true);
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
        shareReplay(1),
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
        shareReplay(1),
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
        shareReplay(1),
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
