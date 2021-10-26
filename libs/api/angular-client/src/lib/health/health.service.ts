import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Endpoints } from '@biosimulations/config/common';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class HealthService {
  private endpoints = new Endpoints();

  constructor(private http: HttpClient) {}

  isHealthy(): Observable<boolean> {
    const url = this.endpoints.getApiHealthEndpoint();
    return this.http.get<any[]>(url).pipe(
      map((response: any): boolean => {
        return true;
      }),
      catchError((error: HttpErrorResponse): Observable<false> => {
        return of<false>(false);
      }),
    );
  }
}
