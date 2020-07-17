import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  ModelsDocument,
  ModelDocument,
  ModelResource,
} from '@biosimulations/datamodel/api';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, pluck, tap } from 'rxjs/operators';
import { Model } from '../model';
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
  private initialLoadStarted$ = new BehaviorSubject(false);
  private initialLoadFinished$ = new BehaviorSubject(false);

  // Is there an active http request?
  private loading$ = new BehaviorSubject(false);

  // Refresh the mapping. Maybe call this at app init?
  private refreshAll() {
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
    this.http
      .get<ModelDocument>(this.url + '/' + id)
      .pipe(pluck('data'))
      .subscribe((model: ModelResource) => this.models.set(model.id, model));
  }

  getAll(): Observable<ModelResource[]> {
    if (!this.firstLoad) {
      this.refreshAll().subscribe();
    }
    return this.models$
      .asObservable()
      .pipe(
        map((value: Map<string, ModelResource>) =>
          Array.from(value).map((mapVal) => mapVal[1]),
        ),
      );
  }

  get(id: string) {
    return this.models$.pipe(
      map((modelMap: Map<string, ModelResource>) => modelMap.get(id)),
    );
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
