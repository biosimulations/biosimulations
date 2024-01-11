/**
 * simdata-api
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { Observable }                                        from 'rxjs';

import { DatasetData } from '../model/dataset-data';
import { HTTPValidationError } from '../model/http-validation-error';


import { Configuration }                                     from '../configuration';


export interface DefaultServiceInterface {
    defaultHeaders: {};
    configuration: Configuration;

    /**
    * Health
    * 
    */
    healthHealthGet(extraHttpRequestParams?: any): Observable<any>;

    /**
    * Read Dataset
    * 
    * @param runId 
    * @param datasetName 
    */
    readDatasetDatasetsRunIdGet(runId: string, datasetName: string, extraHttpRequestParams?: any): Observable<DatasetData>;

    /**
    * Root
    * 
    */
    rootGet(extraHttpRequestParams?: any): Observable<any>;

}
