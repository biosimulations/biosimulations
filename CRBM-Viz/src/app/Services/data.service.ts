import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Timecourse } from '../Models/timecourse';
import { Observable } from 'rxjs';
import { Time } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}
  dataURL = 'https://crbm-test-api.herokuapp.com/data/';

  getHeaders(id: string): Observable<Timecourse[]> {
    const headers = this.http.get<Timecourse[]>(this.dataURL + id);
    return headers;
  }
  getTimecourse(id: string): Observable<Timecourse[]> {
    const data = this.http.get<Timecourse[]>(this.dataURL + id);
    return data;
  }
}
