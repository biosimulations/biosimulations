import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User, UserSerializer } from '../Models/user';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { Profile } from '@biosimulations/datamodel/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  private endpoint = environment.crbm.CRBMAPI_URL;
  private newEndpoint = 'api.biosimulations.dev';
  private serializer = new UserSerializer();

  get$(username?: string): Observable<User> {
    let user: Observable<User>;
    user = this.http
      .get<Profile>(this.endpoint + '/users/' + username)
      .pipe(map((data) => this.serializer.fromJson(data)));
    return user;
  }

  list$(): Observable<User[]> {
    return this.http.get<object[]>(this.endpoint + '/models').pipe(
      map((modelsJson: object[]) => {
        const models: User[] = [];

        modelsJson.forEach((modelJson) => {
          const testModel = this.serializer.fromJson(modelJson);
          models.push(testModel);
        });
        return models;
      }),
    );
  }

  set(user: User, userName: string, id: string): Observable<User> {
    user.userId = id;
    return this.http
      .put<User>(
        this.endpoint + '/users/' + userName,
        this.serializer.toJson(user),
      )
      .pipe(map((data) => this.serializer.fromJson(data)));
  }
}
