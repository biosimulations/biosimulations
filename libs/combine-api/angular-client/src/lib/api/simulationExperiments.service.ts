/**
 * BioSimulations COMBINE API
 * Endpoints for working with models (e.g., [CellML](https://cellml.org/), [SBML](http://sbml.org/)), simulation experiments (e.g., [Simulation Experiment Description Language (SED-ML)](https://sed-ml.org/)), metadata ([OMEX Metadata](https://sys-bio.github.io/libOmexMeta/)), and simulation projects ([COMBINE/OMEX archives](https://combinearchive.org/)).  Note, this API may change significantly in the future.
 *
 * The version of the OpenAPI document: 0.1
 * Contact: info@biosimulations.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
  HttpEvent,
  HttpParameterCodec,
} from '@angular/common/http';
import { CustomHttpParameterCodec } from '../encoder';
import { Observable } from 'rxjs';

import { CombineArchiveSedDocSpecs } from '../model/models';
import { SedDocument } from '../model/models';
import { ValidationReport } from '../model/models';

import { BASE_PATH } from '../variables';
import { Configuration } from '../configuration';

@Injectable({
  providedIn: 'root',
})
export class SimulationExperimentsService {
  protected basePath = 'https://combine.api.biosimulations.dev';
  public defaultHeaders = new HttpHeaders();
  public configuration = new Configuration();
  public encoder: HttpParameterCodec;

  constructor(
    protected httpClient: HttpClient,
    @Optional() @Inject(BASE_PATH) basePath: string,
    @Optional() configuration: Configuration,
  ) {
    if (configuration) {
      this.configuration = configuration;
    }
    if (typeof this.configuration.basePath !== 'string') {
      if (typeof basePath !== 'string') {
        basePath = this.basePath;
      }
      this.configuration.basePath = basePath;
    }
    this.encoder = this.configuration.encoder || new CustomHttpParameterCodec();
  }

  /**
   * @param consumes string[] mime-types
   * @return true: consumes contains 'multipart/form-data', false: otherwise
   */
  private canConsumeForm(consumes: string[]): boolean {
    const form = 'multipart/form-data';
    for (const consume of consumes) {
      if (form === consume) {
        return true;
      }
    }
    return false;
  }

  private addToHttpParams(
    httpParams: HttpParams,
    value: any,
    key?: string,
  ): HttpParams {
    if (typeof value === 'object' && value instanceof Date === false) {
      httpParams = this.addToHttpParamsRecursive(httpParams, value);
    } else {
      httpParams = this.addToHttpParamsRecursive(httpParams, value, key);
    }
    return httpParams;
  }

  private addToHttpParamsRecursive(
    httpParams: HttpParams,
    value?: any,
    key?: string,
  ): HttpParams {
    if (value == null) {
      return httpParams;
    }

    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        (value as any[]).forEach(
          (elem) =>
            (httpParams = this.addToHttpParamsRecursive(httpParams, elem, key)),
        );
      } else if (value instanceof Date) {
        if (key != null) {
          httpParams = httpParams.append(
            key,
            (value as Date).toISOString().substr(0, 10),
          );
        } else {
          throw Error('key may not be null if value is Date');
        }
      } else {
        Object.keys(value).forEach(
          (k) =>
            (httpParams = this.addToHttpParamsRecursive(
              httpParams,
              value[k],
              key != null ? `${key}.${k}` : k,
            )),
        );
      }
    } else if (key != null) {
      httpParams = httpParams.append(key, value);
    } else {
      throw Error('key may not be null if value is not object or array');
    }
    return httpParams;
  }

  /**
   * Get the specifications of the SED-ML files in a COMBINE/OMEX archive
   * Get the specifications of the SED-ML files in a COMBINE/OMEX archive
   * @param file The two files uploaded in creating a combine archive
   * @param url URL
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public srcHandlersCombineGetSedmlSpecsForCombineArchiveHandler(
    file?: Blob,
    url?: string,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' },
  ): Observable<CombineArchiveSedDocSpecs>;
  public srcHandlersCombineGetSedmlSpecsForCombineArchiveHandler(
    file?: Blob,
    url?: string,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' },
  ): Observable<HttpResponse<CombineArchiveSedDocSpecs>>;
  public srcHandlersCombineGetSedmlSpecsForCombineArchiveHandler(
    file?: Blob,
    url?: string,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' },
  ): Observable<HttpEvent<CombineArchiveSedDocSpecs>>;
  public srcHandlersCombineGetSedmlSpecsForCombineArchiveHandler(
    file?: Blob,
    url?: string,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: 'application/json' },
  ): Observable<any> {
    let localVarHeaders = this.defaultHeaders;

    let localVarHttpHeaderAcceptSelected: string | undefined =
      options && options.httpHeaderAccept;
    if (localVarHttpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = ['application/json'];
      localVarHttpHeaderAcceptSelected =
        this.configuration.selectHeaderAccept(httpHeaderAccepts);
    }
    if (localVarHttpHeaderAcceptSelected !== undefined) {
      localVarHeaders = localVarHeaders.set(
        'Accept',
        localVarHttpHeaderAcceptSelected,
      );
    }

    // to determine the Content-Type header
    const consumes: string[] = ['multipart/form-data'];

    const canConsumeForm = this.canConsumeForm(consumes);

    let localVarFormParams: { append(param: string, value: any): any };
    const localVarUseForm = false;
    const localVarConvertFormParamsToString = false;
    if (localVarUseForm) {
      localVarFormParams = new FormData();
    } else {
      localVarFormParams = new HttpParams({ encoder: this.encoder });
    }

    let responseType_: 'text' | 'json' = 'json';
    if (
      localVarHttpHeaderAcceptSelected &&
      localVarHttpHeaderAcceptSelected.startsWith('text')
    ) {
      responseType_ = 'text';
    }

    return this.httpClient.post<CombineArchiveSedDocSpecs>(
      `${this.configuration.basePath}/combine/sedml-specs`,
      localVarConvertFormParamsToString
        ? localVarFormParams.toString()
        : localVarFormParams,
      {
        responseType: <any>responseType_,
        withCredentials: this.configuration.withCredentials,
        headers: localVarHeaders,
        observe: observe,
        reportProgress: reportProgress,
      },
    );
  }

  /**
   * Get the possible observables of a simulation as a list of SED-ML variables.
   * @param modelLanguage A SED-ML URN for a model language.  The full list of recognized values is available at https://sed-ml.org/urns.html.
   * @param simulationType Type of simulation.
   * @param modelingFramework Identifier for an SBO term
   * @param simulationAlgorithm KiSAO id
   * @param modelFile The two files uploaded in creating a combine archive
   * @param modelUrl URL
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public srcHandlersSedMlGetParametersVariablesForSimulationHandler(
    modelLanguage: string,
    simulationType: string,
    modelingFramework: string,
    simulationAlgorithm: string,
    modelFile?: Blob,
    modelUrl?: string,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' },
  ): Observable<SedDocument>;
  public srcHandlersSedMlGetParametersVariablesForSimulationHandler(
    modelLanguage: string,
    simulationType: string,
    modelingFramework: string,
    simulationAlgorithm: string,
    modelFile?: Blob,
    modelUrl?: string,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' },
  ): Observable<HttpResponse<SedDocument>>;
  public srcHandlersSedMlGetParametersVariablesForSimulationHandler(
    modelLanguage: string,
    simulationType: string,
    modelingFramework: string,
    simulationAlgorithm: string,
    modelFile?: Blob,
    modelUrl?: string,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' },
  ): Observable<HttpEvent<SedDocument>>;
  public srcHandlersSedMlGetParametersVariablesForSimulationHandler(
    modelLanguage: string,
    simulationType: string,
    modelingFramework: string,
    simulationAlgorithm: string,
    modelFile?: Blob,
    modelUrl?: string,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: 'application/json' },
  ): Observable<any> {
    if (modelLanguage === null || modelLanguage === undefined) {
      throw new Error(
        'Required parameter modelLanguage was null or undefined when calling srcHandlersSedMlGetParametersVariablesForSimulationHandler.',
      );
    }
    if (simulationType === null || simulationType === undefined) {
      throw new Error(
        'Required parameter simulationType was null or undefined when calling srcHandlersSedMlGetParametersVariablesForSimulationHandler.',
      );
    }
    if (modelingFramework === null || modelingFramework === undefined) {
      throw new Error(
        'Required parameter modelingFramework was null or undefined when calling srcHandlersSedMlGetParametersVariablesForSimulationHandler.',
      );
    }
    if (simulationAlgorithm === null || simulationAlgorithm === undefined) {
      throw new Error(
        'Required parameter simulationAlgorithm was null or undefined when calling srcHandlersSedMlGetParametersVariablesForSimulationHandler.',
      );
    }

    let localVarHeaders = this.defaultHeaders;

    let localVarHttpHeaderAcceptSelected: string | undefined =
      options && options.httpHeaderAccept;
    if (localVarHttpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = ['application/json'];
      localVarHttpHeaderAcceptSelected =
        this.configuration.selectHeaderAccept(httpHeaderAccepts);
    }
    if (localVarHttpHeaderAcceptSelected !== undefined) {
      localVarHeaders = localVarHeaders.set(
        'Accept',
        localVarHttpHeaderAcceptSelected,
      );
    }

    // to determine the Content-Type header
    const consumes: string[] = ['multipart/form-data'];

    const canConsumeForm = this.canConsumeForm(consumes);

    let localVarFormParams: { append(param: string, value: any): any };
    const localVarUseForm = false;
    const localVarConvertFormParamsToString = false;
    if (localVarUseForm) {
      localVarFormParams = new FormData();
    } else {
      localVarFormParams = new HttpParams({ encoder: this.encoder });
    }

    let responseType_: 'text' | 'json' = 'json';
    if (
      localVarHttpHeaderAcceptSelected &&
      localVarHttpHeaderAcceptSelected.startsWith('text')
    ) {
      responseType_ = 'text';
    }

    return this.httpClient.post<SedDocument>(
      `${this.configuration.basePath}/sed-ml/get-parameters-variables-for-simulation`,
      localVarConvertFormParamsToString
        ? localVarFormParams.toString()
        : localVarFormParams,
      {
        responseType: <any>responseType_,
        withCredentials: this.configuration.withCredentials,
        headers: localVarHeaders,
        observe: observe,
        reportProgress: reportProgress,
      },
    );
  }

  /**
   * Validate a SED-ML file
   * Validate a [Simulation Experiment Description Markup Language (SED-ML)](https://sed-ml.org/) file. Note, this method does not validate the sources of the models of SED-ML files or targets to models. Models files are required for more comprehensive validation. The &#x60;/combine/validate&#x60; endpoint provides more comprehensive validation that encompasses validation of model sources and targets to models.
   * @param file The two files uploaded in creating a combine archive
   * @param url URL
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public srcHandlersSedMlValidateHandler(
    file?: Blob,
    url?: string,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' },
  ): Observable<ValidationReport>;
  public srcHandlersSedMlValidateHandler(
    file?: Blob,
    url?: string,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' },
  ): Observable<HttpResponse<ValidationReport>>;
  public srcHandlersSedMlValidateHandler(
    file?: Blob,
    url?: string,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' },
  ): Observable<HttpEvent<ValidationReport>>;
  public srcHandlersSedMlValidateHandler(
    file?: Blob,
    url?: string,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: 'application/json' },
  ): Observable<any> {
    let localVarHeaders = this.defaultHeaders;

    let localVarHttpHeaderAcceptSelected: string | undefined =
      options && options.httpHeaderAccept;
    if (localVarHttpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = ['application/json'];
      localVarHttpHeaderAcceptSelected =
        this.configuration.selectHeaderAccept(httpHeaderAccepts);
    }
    if (localVarHttpHeaderAcceptSelected !== undefined) {
      localVarHeaders = localVarHeaders.set(
        'Accept',
        localVarHttpHeaderAcceptSelected,
      );
    }

    // to determine the Content-Type header
    const consumes: string[] = ['multipart/form-data'];

    const canConsumeForm = this.canConsumeForm(consumes);

    let localVarFormParams: { append(param: string, value: any): any };
    const localVarUseForm = false;
    const localVarConvertFormParamsToString = false;
    if (localVarUseForm) {
      localVarFormParams = new FormData();
    } else {
      localVarFormParams = new HttpParams({ encoder: this.encoder });
    }

    let responseType_: 'text' | 'json' = 'json';
    if (
      localVarHttpHeaderAcceptSelected &&
      localVarHttpHeaderAcceptSelected.startsWith('text')
    ) {
      responseType_ = 'text';
    }

    return this.httpClient.post<ValidationReport>(
      `${this.configuration.basePath}/sed-ml/validate`,
      localVarConvertFormParamsToString
        ? localVarFormParams.toString()
        : localVarFormParams,
      {
        responseType: <any>responseType_,
        withCredentials: this.configuration.withCredentials,
        headers: localVarHeaders,
        observe: observe,
        reportProgress: reportProgress,
      },
    );
  }
}
