import { Injectable } from '@angular/core';
import { TopLevelResource } from '../Models/top-level-resource';
import { HttpClient } from '@angular/common/http';
import { Serializer } from '../Serializers/serializer';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { QueryOptions } from '../Models/query-options';

export class ResourceService<T extends TopLevelResource> {
  constructor(
    private httpClient: HttpClient,
    private endpoint: string,
    private serializer: Serializer<T>,
    private url: string = environment.crbm.CRBMAPI_URL
  ) {}
  public create(item: T): Observable<T> {
    return this.httpClient
      .post<T>(`${this.url}/${this.endpoint}`, this.serializer.toJson(item))
      .pipe(map(data => this.serializer.fromJson(data) as T));
  }

  public update(item: T): Observable<T> {
    return this.httpClient
      .put<T>(
        `${this.url}/${this.endpoint}/${item.id}`,
        this.serializer.toJson(item)
      )
      .pipe(map(data => this.serializer.fromJson(data) as T));
  }

  read(id: string): Observable<T> {
    return this.httpClient
      .get(`${this.url}/${this.endpoint}/${id}`)
      .pipe(map((data: any) => this.serializer.fromJson(data) as T));
  }

  list(queryOptions: QueryOptions = new QueryOptions()): Observable<T[]> {
    // TODO: filter on name, owner attributes
    return this.httpClient
      .get(`${this.url}/${this.endpoint}?${queryOptions.toQueryString()}`)
      .pipe(map((data: any) => this.convertData(data)));
  }

  delete(id: string) {
    return this.httpClient.delete(`${this.url}/${this.endpoint}/${id}`);
  }

  private convertData(data: any): T[] {
    return data.map(item => this.serializer.fromJson(item));
  }
}
