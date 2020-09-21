import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { urls } from '@biosimulations/config/common';
import { shareReplay } from 'rxjs/operators';
//TODO set the api interface type
@Injectable({ providedIn: 'root' })
export class SimulatorService {
  endpoint = urls.simulatorsApi + 'simulators/';
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.endpoint).pipe(shareReplay(1));
  }
  getLatest(): Observable<any[]> {
    return this.http.get<any[]>(this.endpoint + 'latest').pipe(shareReplay(1));
  }
  constructor(private http: HttpClient) {}
}
