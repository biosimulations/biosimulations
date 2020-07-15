import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  ModelsDocument,
  ModelDocument,
  ModelResource,
} from '@biosimulations/datamodel/api';
import { Observable } from 'rxjs';
import { map, pluck, tap } from 'rxjs/operators';
import { Model } from '../model';
@Injectable({
  providedIn: 'root',
})
export class ModelHttpService {
  name = 'model';
  url = 'https://api.biosimulations.dev/models';
  //url = 'http://localhost:3333/models';
  constructor(private http: HttpClient) {}
  // TODO make this a behavior subject that updates as needed
  models: Map<string, ModelResource> = new Map();
  loadAll() {
    return this.http.get<ModelsDocument>(this.url).pipe(
      pluck('data'),
      tap((data) => this.cacheAll(data)),
    );
  }
  loadAllCache() {
    for (let i = 0; i++; localStorage.key(i) !== null) {}
  }

  cacheAll(data: ModelResource[]) {
    data.forEach((element: ModelResource, index: number) => {
      try {
        localStorage.setItem(this.name + index, JSON.stringify(data[index]));
      } catch (err) {
        console.log(err);
      }
    });
  }
  load(id: string) {
    this.http.get<ModelDocument>(this.url + '/' + id);
  }

  post() {
    this.http.post<ModelDocument>(this.url, {});
  }
}
