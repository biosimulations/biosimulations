import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  ModelsDocument,
  ModelDocument,
  ModelResource,
} from '@biosimulations/datamodel/api';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { Model } from '../model';
@Injectable({
  providedIn: 'root',
})
export class ModelHttpService {
  // url = 'https://api.biosimulations.dev/models';
  url = 'http://localhost:3333/models';
  constructor(private http: HttpClient) {}
  // TODO make this a behavior subject that updates as needed
  models: Map<string, ModelResource> = new Map();
  loadAll() {
    return this.http.get<ModelsDocument>(this.url).pipe(pluck('data'));
  }

  load(id: string) {
    this.http.get<ModelDocument>(this.url + '/' + id);
  }

  post() {
    this.http.post<ModelDocument>(this.url, {});
  }
}
