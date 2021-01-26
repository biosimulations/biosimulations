import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  ModelsDocument,
  ModelDocument,
  ModelResource,
} from '@biosimulations/platform/api-models';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, pluck, tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ModelHttpService {
  name = 'model';
  url = 'https://api.biosimulations.dev/models';
  // url = 'http://localhost:3333/models';

  constructor(private http: HttpClient) {}

  // A map of id to http response for each model
  private models: Map<string, ModelResource> = new Map();

  // Behavior subject from the initial loading of the models. Blank at creation
  private models$ = new BehaviorSubject(this.models);

  // has the data been loaded at least once?
  private firstLoad = false;

  // Loading timings, probably not needed
  private initialLoadStarted$ = new BehaviorSubject(false);
  private initialLoadFinished$ = new BehaviorSubject(false);

  // Is there an active http request?
  private loading$ = new BehaviorSubject(false);

  // Refresh the mapping. Maybe call this at app init?
  public refresh(id?: string) {
    if (id) {
      this.load(id).subscribe();
    } else {
      this.loadAll().subscribe();
    }
  }

  // Load all the models from api, save to map
  private loadAll() {
    this.firstLoad = true;
    this.loading$.next(true);
    return this.http.get<ModelsDocument>(this.url).pipe(
      pluck('data'),
      map((value: ModelResource[]) => {
        value.forEach((model: ModelResource) => {
          this.models.set(model.id, model);
        });
        this.models$.next(this.models);
      }),
      tap((_) => this.loading$.next(false)),
    );
  }
  private load(id: string) {
    this.loading$.next(true);
    return this.http.get<ModelDocument>(this.url + '/' + id).pipe(
      catchError((error: HttpErrorResponse) => {
        this.loading$.next(false);
        return throwError(
          error.error.message || error.statusText || error.message,
        );
      }),
      pluck('data'),
      tap((model: ModelResource) => {
        this.set(id, model);
        this.loading$.next(false);
      }),
    );
  }

  private set(id: string, model: ModelResource) {
    this.models.set(model.id, model);
    this.models$.next(this.models);
  }

  public getAll(): Observable<ModelResource[]> {
    if (!this.firstLoad) {
      this.loadAll().subscribe();
    }
    return this.models$
      .asObservable()
      .pipe(
        map((value: Map<string, ModelResource>) =>
          Array.from(value).map((mapVal) => mapVal[1]),
        ),
      );
  }

  public get(id: string): Observable<ModelResource | undefined> {
    if (this.models.get(id)) {
      return this.models$
        .asObservable()
        .pipe(map((modelMap: Map<string, ModelResource>) => modelMap.get(id)));
    } else {
      return this.load(id);
    }
  }

  /**
   * Returns an observable of the current request status
   *
   */
  public isLoading$() {
    return this.loading$.asObservable();
  }
  post() {
    this.http.post<ModelDocument>(this.url, {});
  }
}
