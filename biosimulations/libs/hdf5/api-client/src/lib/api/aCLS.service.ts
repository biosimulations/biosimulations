/**
 * BioSimulations Data Service
 * RESTful application programming interface documentation for the Biosimulations Data Service, based on the HDF Scalable Data Service (HSDS) from the HDF Group.
 *
 * The version of the OpenAPI document: 1.0
 * Contact: info@biosimulations.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/* tslint:disable:no-unused-variable member-ordering */

import { HttpService, Inject, Injectable, Optional } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { InlineObject8 } from '../model/inlineObject8';
import { InlineResponse20016 } from '../model/inlineResponse20016';
import { InlineResponse20017 } from '../model/inlineResponse20017';
import { InlineResponse20018 } from '../model/inlineResponse20018';
import { InlineResponse20019 } from '../model/inlineResponse20019';
import { Configuration } from '../configuration';

@Injectable()
export class ACLSService {
  protected basePath = 'https://data.biosimulations.dev';
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
   * Get access lists on Domain.
   *
   * @param accept Accept header
   * @param domain
   * @param authorization
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public aclsGet(
    accept: 'application/json',
    domain?: string,
    authorization?: string,
  ): Observable<AxiosResponse<InlineResponse20016>>;
  public aclsGet(
    accept: 'application/json',
    domain?: string,
    authorization?: string,
  ): Observable<any> {
    if (accept === null || accept === undefined) {
      throw new Error(
        'Required parameter accept was null or undefined when calling aclsGet.',
      );
    }

    let queryParameters = {};
    if (domain !== undefined && domain !== null) {
      queryParameters['domain'] = <any>domain;
    }

    let headers = this.defaultHeaders;
    if (accept !== undefined && accept !== null) {
      headers['Accept'] = String(accept);
    }
    if (authorization !== undefined && authorization !== null) {
      headers['Authorization'] = String(authorization);
    }

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['application/json'];
    const httpHeaderAcceptSelected:
      | string
      | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers['Accept'] = httpHeaderAcceptSelected;
    }

    // to determine the Content-Type header
    const consumes: string[] = [];
    return this.httpClient.get<InlineResponse20016>(`${this.basePath}/acls`, {
      params: queryParameters,
      withCredentials: this.configuration.withCredentials,
      headers: headers,
    });
  }
  /**
   * Get users\&#39;s access to a Domain.
   *
   * @param accept Accept header
   * @param user User identifier/name.
   * @param domain
   * @param authorization
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public aclsUserGet(
    accept: 'application/json',
    user: string,
    domain?: string,
    authorization?: string,
  ): Observable<AxiosResponse<InlineResponse20017>>;
  public aclsUserGet(
    accept: 'application/json',
    user: string,
    domain?: string,
    authorization?: string,
  ): Observable<any> {
    if (accept === null || accept === undefined) {
      throw new Error(
        'Required parameter accept was null or undefined when calling aclsUserGet.',
      );
    }

    if (user === null || user === undefined) {
      throw new Error(
        'Required parameter user was null or undefined when calling aclsUserGet.',
      );
    }

    let queryParameters = {};
    if (domain !== undefined && domain !== null) {
      queryParameters['domain'] = <any>domain;
    }

    let headers = this.defaultHeaders;
    if (accept !== undefined && accept !== null) {
      headers['Accept'] = String(accept);
    }
    if (authorization !== undefined && authorization !== null) {
      headers['Authorization'] = String(authorization);
    }

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['application/json'];
    const httpHeaderAcceptSelected:
      | string
      | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers['Accept'] = httpHeaderAcceptSelected;
    }

    // to determine the Content-Type header
    const consumes: string[] = [];
    return this.httpClient.get<InlineResponse20017>(
      `${this.basePath}/acls/${encodeURIComponent(String(user))}`,
      {
        params: queryParameters,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
      },
    );
  }
  /**
   * Set user\&#39;s access to the Domain.
   *
   * @param user Identifier/name of a user.
   * @param accept Accept header
   * @param inlineObject8
   * @param domain
   * @param authorization
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public aclsUserPut(
    user: string,
    accept: 'application/json',
    inlineObject8: InlineObject8,
    domain?: string,
    authorization?: string,
  ): Observable<AxiosResponse<InlineResponse20018>>;
  public aclsUserPut(
    user: string,
    accept: 'application/json',
    inlineObject8: InlineObject8,
    domain?: string,
    authorization?: string,
  ): Observable<any> {
    if (user === null || user === undefined) {
      throw new Error(
        'Required parameter user was null or undefined when calling aclsUserPut.',
      );
    }

    if (accept === null || accept === undefined) {
      throw new Error(
        'Required parameter accept was null or undefined when calling aclsUserPut.',
      );
    }

    if (inlineObject8 === null || inlineObject8 === undefined) {
      throw new Error(
        'Required parameter inlineObject8 was null or undefined when calling aclsUserPut.',
      );
    }

    let queryParameters = {};
    if (domain !== undefined && domain !== null) {
      queryParameters['domain'] = <any>domain;
    }

    let headers = this.defaultHeaders;
    if (accept !== undefined && accept !== null) {
      headers['Accept'] = String(accept);
    }
    if (authorization !== undefined && authorization !== null) {
      headers['Authorization'] = String(authorization);
    }

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['application/json'];
    const httpHeaderAcceptSelected:
      | string
      | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers['Accept'] = httpHeaderAcceptSelected;
    }

    // to determine the Content-Type header
    const consumes: string[] = ['application/json'];
    const httpContentTypeSelected:
      | string
      | undefined = this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected != undefined) {
      headers['Content-Type'] = httpContentTypeSelected;
    }
    return this.httpClient.put<InlineResponse20018>(
      `${this.basePath}/acls/${encodeURIComponent(String(user))}`,
      inlineObject8,
      {
        params: queryParameters,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
      },
    );
  }
  /**
   * Get access lists on Dataset.
   *
   * @param id UUID of the Dataset.
   * @param accept Accept header
   * @param domain
   * @param authorization
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public datasetsIdAclsGet(
    id: string,
    accept: 'application/json',
    domain?: string,
    authorization?: string,
  ): Observable<AxiosResponse<InlineResponse20016>>;
  public datasetsIdAclsGet(
    id: string,
    accept: 'application/json',
    domain?: string,
    authorization?: string,
  ): Observable<any> {
    if (id === null || id === undefined) {
      throw new Error(
        'Required parameter id was null or undefined when calling datasetsIdAclsGet.',
      );
    }

    if (accept === null || accept === undefined) {
      throw new Error(
        'Required parameter accept was null or undefined when calling datasetsIdAclsGet.',
      );
    }

    let queryParameters = {};
    if (domain !== undefined && domain !== null) {
      queryParameters['domain'] = <any>domain;
    }

    let headers = this.defaultHeaders;
    if (accept !== undefined && accept !== null) {
      headers['Accept'] = String(accept);
    }
    if (authorization !== undefined && authorization !== null) {
      headers['Authorization'] = String(authorization);
    }

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['application/json'];
    const httpHeaderAcceptSelected:
      | string
      | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers['Accept'] = httpHeaderAcceptSelected;
    }

    // to determine the Content-Type header
    const consumes: string[] = [];
    return this.httpClient.get<InlineResponse20016>(
      `${this.basePath}/datasets/${encodeURIComponent(String(id))}/acls`,
      {
        params: queryParameters,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
      },
    );
  }
  /**
   * List access lists on Datatype.
   *
   * @param id UUID of the committed datatype.
   * @param accept Accept header
   * @param domain
   * @param authorization
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public datatypesIdAclsGet(
    id: string,
    accept: 'application/json',
    domain?: string,
    authorization?: string,
  ): Observable<AxiosResponse<InlineResponse20019>>;
  public datatypesIdAclsGet(
    id: string,
    accept: 'application/json',
    domain?: string,
    authorization?: string,
  ): Observable<any> {
    if (id === null || id === undefined) {
      throw new Error(
        'Required parameter id was null or undefined when calling datatypesIdAclsGet.',
      );
    }

    if (accept === null || accept === undefined) {
      throw new Error(
        'Required parameter accept was null or undefined when calling datatypesIdAclsGet.',
      );
    }

    let queryParameters = {};
    if (domain !== undefined && domain !== null) {
      queryParameters['domain'] = <any>domain;
    }

    let headers = this.defaultHeaders;
    if (accept !== undefined && accept !== null) {
      headers['Accept'] = String(accept);
    }
    if (authorization !== undefined && authorization !== null) {
      headers['Authorization'] = String(authorization);
    }

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['application/json'];
    const httpHeaderAcceptSelected:
      | string
      | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers['Accept'] = httpHeaderAcceptSelected;
    }

    // to determine the Content-Type header
    const consumes: string[] = [];
    return this.httpClient.get<InlineResponse20019>(
      `${this.basePath}/datatypes/${encodeURIComponent(String(id))}/acls`,
      {
        params: queryParameters,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
      },
    );
  }
  /**
   * List access lists on Group.
   *
   * @param id UUID of the Group, e.g. &#x60;g-37aa76f6-2c86-11e8-9391-0242ac110009&#x60;.
   * @param accept Accept header
   * @param domain
   * @param authorization
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public groupsIdAclsGet(
    id: string,
    accept: 'application/json',
    domain?: string,
    authorization?: string,
  ): Observable<AxiosResponse<InlineResponse20016>>;
  public groupsIdAclsGet(
    id: string,
    accept: 'application/json',
    domain?: string,
    authorization?: string,
  ): Observable<any> {
    if (id === null || id === undefined) {
      throw new Error(
        'Required parameter id was null or undefined when calling groupsIdAclsGet.',
      );
    }

    if (accept === null || accept === undefined) {
      throw new Error(
        'Required parameter accept was null or undefined when calling groupsIdAclsGet.',
      );
    }

    let queryParameters = {};
    if (domain !== undefined && domain !== null) {
      queryParameters['domain'] = <any>domain;
    }

    let headers = this.defaultHeaders;
    if (accept !== undefined && accept !== null) {
      headers['Accept'] = String(accept);
    }
    if (authorization !== undefined && authorization !== null) {
      headers['Authorization'] = String(authorization);
    }

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['application/json'];
    const httpHeaderAcceptSelected:
      | string
      | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers['Accept'] = httpHeaderAcceptSelected;
    }

    // to determine the Content-Type header
    const consumes: string[] = [];
    return this.httpClient.get<InlineResponse20016>(
      `${this.basePath}/groups/${encodeURIComponent(String(id))}/acls`,
      {
        params: queryParameters,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
      },
    );
  }
  /**
   * Get users\&#39;s access to a Group.
   *
   * @param id UUID of the Group, e.g. &#x60;g-37aa76f6-2c86-11e8-9391-0242ac110009&#x60;.
   * @param user Identifier/name of a user.
   * @param accept Accept header
   * @param domain
   * @param authorization
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public groupsIdAclsUserGet(
    id: string,
    user: string,
    accept: 'application/json',
    domain?: string,
    authorization?: string,
  ): Observable<AxiosResponse<InlineResponse20017>>;
  public groupsIdAclsUserGet(
    id: string,
    user: string,
    accept: 'application/json',
    domain?: string,
    authorization?: string,
  ): Observable<any> {
    if (id === null || id === undefined) {
      throw new Error(
        'Required parameter id was null or undefined when calling groupsIdAclsUserGet.',
      );
    }

    if (user === null || user === undefined) {
      throw new Error(
        'Required parameter user was null or undefined when calling groupsIdAclsUserGet.',
      );
    }

    if (accept === null || accept === undefined) {
      throw new Error(
        'Required parameter accept was null or undefined when calling groupsIdAclsUserGet.',
      );
    }

    let queryParameters = {};
    if (domain !== undefined && domain !== null) {
      queryParameters['domain'] = <any>domain;
    }

    let headers = this.defaultHeaders;
    if (accept !== undefined && accept !== null) {
      headers['Accept'] = String(accept);
    }
    if (authorization !== undefined && authorization !== null) {
      headers['Authorization'] = String(authorization);
    }

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['application/json'];
    const httpHeaderAcceptSelected:
      | string
      | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers['Accept'] = httpHeaderAcceptSelected;
    }

    // to determine the Content-Type header
    const consumes: string[] = [];
    return this.httpClient.get<InlineResponse20017>(
      `${this.basePath}/groups/${encodeURIComponent(
        String(id),
      )}/acls/${encodeURIComponent(String(user))}`,
      {
        params: queryParameters,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
      },
    );
  }
}
