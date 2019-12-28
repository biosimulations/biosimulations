import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BioModelService {
  endpoint: string = environment.crbm.CRBMAPI_URL;
  constructor(private http: HttpClient) {}

  get(id: string): Observable<any> {
    console.log('biomodels get');
    return this.http.get<any>(this.endpoint + '/models/' + id);
    // return of(ModelService._get(id, true));
  }
}
