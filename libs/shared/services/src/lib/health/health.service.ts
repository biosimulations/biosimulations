import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class HealthService {
  constructor(private http: HttpClient) {}

  isHealthy(url: string): Observable<boolean> {
    return of(true);

    /*
    return this.http.get<any[]>(url).pipe(
      map((response: any): boolean => {
        return true;
      }),
      catchError((error: HttpErrorResponse): Observable<false> => {
        return of<false>(false);
      }),
    );
    */
  }
}
