import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModelsDocument, ModelDocument } from '@biosimulations/datamodel/api';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ModelHttpService {
  url = 'https://api.biosimulations.org/models';
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<ModelsDocument>(this.url).pipe(pluck('data'));
  }

  getOne(id: string) {
    this.http.get<ModelDocument>(this.url + '/' + id);
  }

  post() {
    this.http.post<ModelDocument>(this.url, {});
  }
}
