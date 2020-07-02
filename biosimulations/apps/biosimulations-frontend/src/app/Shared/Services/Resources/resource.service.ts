import { TopLevelResource } from '../../../Shared/Models/top-level-resource';
import { HttpClient } from '@angular/common/http';
import { Serializer } from '../../../Shared/Serializers/serializer';
import { environment } from '../../../../environments/environment';
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
    return of(this.serializer.fromJson({}) as T);
  }

  public update(item: T): Observable<T> {
    return this.httpClient
      .put(
        `${this.url}/${this.endpoint}/${item.id}`,
        this.serializer.toJson(item),
      )
      .pipe(map((data) => this.serializer.fromJson(data) as T));
  }

  public read(
    id: string,
    queryOptions: QueryOptions = new QueryOptions(),
  ): Observable<T> {
    // TODO confirm that this is still the best approach

    return of(this.serializer.fromJson({}) as T);
  }

  public list(
    queryOptions: QueryOptions = new QueryOptions(),
  ): Observable<T[]> {
    // TODO: filter on name, owner attributes

    return of([]);
  }

  public delete(id: string) {
    return this.httpClient.delete(`${this.url}/${this.endpoint}/${id}`);
  }

  private convertData(data: any): T[] {
    return data.map((item) => this.serializer.fromJson(item));
  }
}
