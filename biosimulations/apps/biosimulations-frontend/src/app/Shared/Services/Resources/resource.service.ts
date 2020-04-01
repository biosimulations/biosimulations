import { TopLevelResource } from 'src/app/Shared/Models/top-level-resource';
import { HttpClient } from '@angular/common/http';
import { Serializer } from 'src/app/Shared/Serializers/serializer';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { QueryOptions } from '../../Enums/query-options';
export class ResourceService<T extends TopLevelResource> {
  constructor(
    private httpClient: HttpClient,
    private endpoint: string,
    private serializer: Serializer<T>,
    private url: string = environment.crbm.CRBMAPI_URL,
  ) {}
  public create(item: T): Observable<T> {
    return this.httpClient
      .post(`${this.url}/${this.endpoint}`, this.serializer.toJson(item))
      .pipe(map(data => this.serializer.fromJson(data) as T));
  }

  public update(item: T): Observable<T> {
    return this.httpClient
      .put(
        `${this.url}/${this.endpoint}/${item.id}`,
        this.serializer.toJson(item),
      )
      .pipe(map(data => this.serializer.fromJson(data) as T));
  }

  public read(
    id: string,
    queryOptions: QueryOptions = new QueryOptions(),
  ): Observable<T> {
    // TODO confirm that this is still the best approach
    if (id === undefined) {
      return of(this.serializer.fromJson({}) as T);
    }
    queryOptions.embed.push('owner');
    return this.httpClient
      .get(`${this.url}/${this.endpoint}/${id}?${queryOptions.toQueryString()}`)
      .pipe(map((data: any) => this.serializer.fromJson(data) as T));
  }

  public list(
    queryOptions: QueryOptions = new QueryOptions(),
  ): Observable<T[]> {
    // TODO: filter on name, owner attributes
    queryOptions.embed.push('owner');
    return this.httpClient
      .get(`${this.url}/${this.endpoint}?${queryOptions.toQueryString()}`)
      .pipe(map((data: any) => this.convertData(data)));
  }

  public delete(id: string) {
    return this.httpClient.delete(`${this.url}/${this.endpoint}/${id}`);
  }

  private convertData(data: any): T[] {
    return data.map(item => this.serializer.fromJson(item));
  }
}
