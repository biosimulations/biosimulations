import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { urls } from '@biosimulations/config/common';
//TODO set the api interface type
@Injectable({ providedIn: 'root' })
export class SimulatorService {
  endpoint = urls.simulatorsApi + 'simulators/';
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.endpoint);
  }
  getLatest(): Observable<any[]> {
    return this.http.get<any[]>(this.endpoint + 'latest');
  }
  constructor(private http: HttpClient) {}
}
