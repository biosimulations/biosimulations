import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}
  endpoint = 'https://crbm.auth0.com/userinfo';

  getUser(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer W0p9s-oFubPuONgWER3JGAqnZ-HkEurI',
      }),
    };
    const Httpheaders = new HttpHeaders({
      Authorization: 'Bearer SY1MOMZZVnEBtzEG7aw-y-JYDEwm-QM3',
    });
    return this.http.get(this.endpoint, { headers: Httpheaders });
  }
}
