import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModelsDocument, ModelDocument } from '@biosimulations/datamodel/api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ModelHttpService {
  url = 'https://api.biosimulations.org/models';
  constructor(private http: HttpClient) {}

  getAll() {
    this.http.get<ModelsDocument>(this.url).pipe(map());
  }

  getOne(id: string) {
    this.http.get<ModelDocument>(this.url + '/' + id);
  }

  post(){
    this.http.post<
  }
}
