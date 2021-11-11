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
import FormData from 'form-data';

import { HttpService, Inject, Injectable, Optional } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { ValidationReport } from '../model/validationReport';
import { Configuration } from '../configuration';

@Injectable()
export class ModelsService {
  protected basePath = 'https://combine.api.biosimulations.dev';
  public defaultHeaders = new Map();
  public configuration = new Configuration();

  constructor(
    protected httpClient: HttpService,
    @Optional() configuration: Configuration,
  ) {
    this.configuration = configuration || this.configuration;
    this.basePath = configuration?.basePath || this.basePath;
  }

  /**
   * @param consumes string[] mime-types
   * @return true: consumes contains 'multipart/form-data', false: otherwise
   */
  private canConsumeForm(consumes: string[]): boolean {
    const form = 'multipart/form-data';
    return consumes.includes(form);
  }

  /**
   * Validate a model
   * Validate a model file such as a [CellML](https://cellml.org) or [Systems Biology Markup Language (SBML)](http://sbml.org) file.  Note, this endpoint is limited to models that are can be captured by a single file. Models that are described via multiple files can be validated using the COMBINE/OMEX archive validation endpoint (&#x60;/combine/validate&#x60;).
   * @param language Language of the model
   * @param file The two files uploaded in creating a combine archive
   * @param url URL
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public srcHandlersModelValidateHandler(
    language: string,
    file?: Blob,
    url?: string,
  ): Observable<AxiosResponse<ValidationReport>>;
  public srcHandlersModelValidateHandler(
    language: string,
    file?: Blob,
    url?: string,
  ): Observable<any> {
    if (language === null || language === undefined) {
      throw new Error(
        'Required parameter language was null or undefined when calling srcHandlersModelValidateHandler.',
      );
    }

    let headers: any = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['application/json'];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers['Accept'] = httpHeaderAcceptSelected;
    }

    // to determine the Content-Type header
    const consumes: string[] = ['multipart/form-data'];

    const canConsumeForm = this.canConsumeForm(consumes);

    let formParams: FormData = new FormData();
    let useForm = false;
    let convertFormParamsToString = false;

    // use FormData to transmit files using content-type "multipart/form-data"
    // see https://stackoverflow.com/questions/4007969/application-x-www-form-urlencoded-or-multipart-form-data
    useForm = canConsumeForm;
    if (useForm) {
      formParams = new FormData();
      headers = formParams.getHeaders();
    } else {
      // formParams = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
    }

    if (file !== undefined) {
      formParams.append('file', <any>file);
    }

    if (url !== undefined) {
      formParams.append('url', <any>url);
    }

    if (language !== undefined) {
      formParams.append('language', <any>language);
    }

    return this.httpClient.post<ValidationReport>(
      `${this.basePath}/model/validate`,
      convertFormParamsToString ? formParams.toString() : formParams,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
      },
    );
  }
}
