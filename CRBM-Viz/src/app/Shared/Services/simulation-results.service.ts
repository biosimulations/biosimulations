import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TimePoint } from '../Models/time-point';
import { Observable } from 'rxjs';
import { Time } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class SimulationResultsService {
  constructor(private http: HttpClient) {}
  dataURL = 'https://crbm-test-api.herokuapp.com/data/';

  getTimePoints(id: string): Observable<TimePoint[]> {
    const data = this.http.get<TimePoint[]>(this.dataURL + id);
    return data;
  }
}
