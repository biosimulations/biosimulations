import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';
import { environment } from '@biosimulations/shared/environments';
import { CombineArchiveSedDocSpecs } from '@biosimulations/datamodel/common';
import { Endpoints } from '@biosimulations/config/common';

@Injectable({
  providedIn: 'root',
})
export class CombineApiService {
  private endpoints = new Endpoints();

  private sedmlSpecsEndpoint = this.endpoints.getSedmlSpecificationsEndpoint(false);

  public constructor(private http: HttpClient) {}

  public getSpecsOfSedDocsInCombineArchive(
    fileOrUrl: File | string,
  ): Observable<CombineArchiveSedDocSpecs | undefined> {
    const formData = new FormData();
    if (typeof fileOrUrl === 'object') {
      formData.append('file', fileOrUrl);
    } else {
      formData.append('url', fileOrUrl);
    }

    return this.http.post<CombineArchiveSedDocSpecs>(this.sedmlSpecsEndpoint, formData).pipe(
      catchError((error: HttpErrorResponse): Observable<undefined> => {
        if (!environment.production) {
          console.error(error);
        }
        return of<undefined>(undefined);
      }),
      shareReplay(1),
    );
  }
}
